import { redis } from '../../../../utils/RedisClient';
const Joi = require('@hapi/joi');

const bodyValidate = (data) => {
    const validation = Joi.object({
        id: Joi.string().min(8).max(128).required(),
        user_info: Joi.object().required()
    });
    return validation.validate(data);
}

export const USER_HASH = 'discordUserHash';

export function verifyMasterPassword(req) {
    const master_password = req.headers['master-password'];
        if (!master_password)
            return { message: 'Invalid authorization' };

        if (master_password !== process.env.DISCORD_CLIENT_SECRET)
            return { message: 'Invalid authorization' };
        return null;
}

export default function handler(req, res) {
    try {
        if (req.method !== 'POST')
            return res.status(400).json({ error: `You cannot ${req.method} this route!` })

        const verifyPassword = verifyMasterPassword(req);
        if (verifyPassword)
            return res.status(400).json(verifyPassword);

        const { error } = bodyValidate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message })

        const { id, user_info } = req.body;
        
        redis.hset(USER_HASH, id, JSON.stringify(user_info));
        res.status(200).json({ success: true })
    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: 'An internal error occured' })
    }
}