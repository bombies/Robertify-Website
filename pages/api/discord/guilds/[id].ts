import { DISCORD_GUILD_HASH } from ".";
import { redis } from "../../../../utils/RedisClient";
import { verifyMasterPassword } from "../users";
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(400).json({ error: `You cannot ${req.method} this route!` })
    
    try {
        const verifyPassword = verifyMasterPassword(req);
        if (verifyPassword)
             return res.status(400).json(verifyPassword); 
        
        const { id } = req.query;
        if (!(/^\d{17,18}$/.test(id.toString())))
            return res.status(400).json({ error: 'Invalid guild ID!' });

        const dataString = await redis.get(DISCORD_GUILD_HASH + id);
        if (!dataString)
            return res.status(404).json({ message: `There was no guild information for user with id ${id}`});
        return res.status(200).json(JSON.parse(dataString));
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