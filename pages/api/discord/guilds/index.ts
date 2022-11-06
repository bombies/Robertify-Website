import { redis } from '../../../../utils/RedisClient';
import { verifyMasterPassword } from '../users';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
const Joi = require('@hapi/joi');

const validateBody = (body) => {
    const validationObj = Joi.object({
        id: Joi.string().regex(/^\d{17,18}$/).required(),
        name: Joi.string().required(),
        icon: Joi.string().allow(null),
        splash: Joi.string().allow(null),
        discovery_splash: Joi.string().allow(null),
        owner_id: Joi.string().required(),
        afk_channel_id: Joi.string().allow(null),
        afk_timeout: Joi.number(),
        widget_enabled: Joi.boolean().allow(null),
        widget_channel_id: Joi.string().allow(null),
        verification_level: Joi.number().required(),
        default_message_notifications: Joi.number().required(),
        explicit_content_filter: Joi.number().required(),
        roles: Joi.array().required(),
        emojis: Joi.array().required(),
        features: Joi.array().required(),
        mfa_level: Joi.number().required(),
        application_id: Joi.string().allow(null),
        system_channel_id: Joi.string().allow(null),
        system_channel_flags: Joi.number().required(),
        rules_channel_id: Joi.string().allow(null),
        max_presences: Joi.number().allow(null),
        max_members: Joi.number(),
        vanity_url_code: Joi.string().allow(null),
        description: Joi.string().allow(null),
        banner: Joi.string().allow(null),
        premium_tier: Joi.number().required(),
        premium_subscription_count: Joi.number(),
        preferred_locale: Joi.string(),
        public_updates_channel_id: Joi.string().allow(null),
        max_video_channel_users: Joi.number(),
        approximate_member_count: Joi.number(),
        approximate_presence_count: Joi.number(),
        welcome_screen: Joi.object(),
        nsfw_level: Joi.number().required(),
        region: Joi.string(),
        hub_type: Joi.any(),
        stickers: Joi.array(),
        nsfw: Joi.boolean().allow(null),
        channels: Joi.array().required(),
        premium_progress_bar_enabled: Joi.boolean().required(),
        max_stage_video_channel_users: Joi.number()
    });
    return validationObj.validate(body);
}

export const DISCORD_GUILD_HASH = 'discordGuildHash#';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST')
        return res.status(400).json({ error: `You cannot ${req.method} this route!` })

    try {
        const verifyPassword = verifyMasterPassword(req);
        if (verifyPassword)
             return res.status(400).json(verifyPassword); 

        const { error } = validateBody(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });

        const result = await redis.setex(DISCORD_GUILD_HASH + req.body.id, 120, JSON.stringify(req.body))
        res.status(200).json({ success: true, result: result })
    } catch (ex) {
        console.log(ex);
    }
}

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
}