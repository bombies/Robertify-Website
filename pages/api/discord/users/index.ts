import { redis } from '../../../../utils/RedisClient';
const Joi = require('@hapi/joi');
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const bodyValidate = (data) => {
    const validation = Joi.object({
        id: Joi.string().min(8).max(128).required(),
        user_info: Joi.object().required()
    });
    return validation.validate(data);
}

export const USER_HASH = 'discordUserHash';

export function verifyMasterPassword(req: NextApiRequest) {
    const master_password = req.headers['master-password'];
        if (!master_password)
            return { message: 'Invalid authorization' };

        if (master_password !== process.env.API_MASTER_PASSWORD)
            return { message: 'Invalid authorization' };
        return null;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
        res.status(500).json({ error: 'An internal error occured' });
    }
}

export default withSentry(handler);

export const config = {
    api: {
      externalResolver: true,
    },
}