import { GUILD_HASH } from ".";
import { verifyMasterPassword } from "..";
import { redis } from "../../../../../utils/RedisClient";
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'GET')
            return res.status(400).json({ message: `You can't ${req.method} this route!`})

        const verifyPassword = verifyMasterPassword(req);
        if (verifyPassword)
            return res.status(400).json(verifyPassword);    

        const { id } = req.query;
        const dataString = await redis.get(`${GUILD_HASH}${id}`);
        if (!dataString)
            return res.status(404).json({ message: `There was no guild information for user with id ${id}`})
        return res.status(200).json(JSON.parse(dataString));
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