import { USER_HASH, verifyMasterPassword } from ".";
import { redis } from "../../../../utils/RedisClient";
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(400).json({ error: `You cannot ${req.method} this route!` })

    const verifyPassword = verifyMasterPassword(req);
    if (verifyPassword)
        return res.status(400).json(verifyPassword);

    const { id } = req.query;

    const userData = await redis.hget(USER_HASH, id.toString());
    if (!userData)
        return res.status(200).json(null);
    res.status(200).json(JSON.parse(userData));
}

export default withSentry(handler);

export const config = {
    api: {
      externalResolver: true,
    },
}