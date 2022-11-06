import { verifyMasterPassword } from '..';
import { redis } from '../../../../../utils/RedisClient';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
const Joi = require('@hapi/joi');

export const GUILD_HASH = 'discordUserGuildHash#';

const validateBody = (body) => {
    const validationObj = Joi.object({
        user_id: Joi.string().regex(/^\d{18}$/).required(),
        guilds: Joi.array().items(Joi.object({
            id: Joi.string().regex(/^\d{17,18}$/).required(),
            name: Joi.string().required(),
            icon: Joi.any(),
            owner: Joi.boolean().required(),
            permissions: Joi.string().required()
        }).required()).required()
    });
    return validationObj.validate(body);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST')
            return res.status(400).json({ message: `You can't ${req.method} this route!`})

        const verifyPassword = verifyMasterPassword(req);
        if (verifyPassword)
            return res.status(400).json(verifyPassword); 

        const { error } = validateBody(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message })

        const { user_id, guilds } = req.body;
        const result = await redis.setex(`${GUILD_HASH}${user_id}`, 3600, JSON.stringify(guilds));
        res.status(200).json({ success: true, result: result })
    } catch (ex) {
        console.log(ex)
        res.status(500).json({ error: 'An internal error occured' });
    }
}

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
}