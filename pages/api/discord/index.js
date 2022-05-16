import { redis } from "../../../utils/RedisClient"
import { verifyMasterPassword } from "./users";
import { withSentry } from '@sentry/nextjs';

const handler = async (req, res) => {
    const hashName = 'discordDataHash';

    try {
        if (req.method === 'POST') {
            const verifyPassword = verifyMasterPassword(req);
            if (verifyPassword)
                return res.status(400).json(verifyPassword); 

            const { id, data } = req.body;
            await redis.hset(hashName, id, JSON.stringify(data));
            return res.status(200).json({id: id})

        } else if (req.method === 'GET') {
            const verifyPassword = verifyMasterPassword(req);
            if (verifyPassword)
                return res.status(400).json(verifyPassword); 

            const { id } = req.query;
            const dataString = await redis.hget(hashName, id);
            return res.status(200).json(JSON.parse(dataString));

        } else 
            res.status(400).json({ error: `Cannot ${req.method} this route!` })
    } catch(ex) {
        console.error(ex);
        res.status(500).json({ error: 'An internal error occured' })
    }
}

export default withSentry(handler);

export const config = {
    api: {
      externalResolver: true,
    },
}