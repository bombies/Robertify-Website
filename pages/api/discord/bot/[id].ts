import { redis } from "../../../../utils/RedisClient";
import { robertifyAPI } from "../../../../utils/RobertifyAPI";
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from "next";
import { verifyMasterPassword } from "../users";

const HASH_NAME = "ROBERTIFY_GUILD";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const verifyPassword = verifyMasterPassword(req);
    if (verifyPassword)
        return res.status(400).json(verifyPassword); 

    const { id } = req.query;
    if (!(/^\d{17,18}$/.test(id.toString())))
        return res.status(400).json({ error: 'Invalid guild ID!' });

    if (req.method !== 'GET')
        res.status(400).json({ error: `Cannot ${req.method} this route!` });
    
    const cachedData = await redis.get(HASH_NAME + id);
    if (cachedData) // Cache hit
        return res.status(200).json(JSON.parse(cachedData));
    
    // Cache miss
    await robertifyAPI.setAccessToken();
    const fetchedData = await robertifyAPI.getGuildInfo(id.toString());
    return res.status(200).json(fetchedData);
}

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
}