import { redis } from "../../../utils/RedisClient"

export default async(req, res) => {
    const hashName = 'discordDataHash';

    try {
        if (req.method === 'POST') {
            const { id, data } = req.body;
            await redis.hset(hashName, id, JSON.stringify(data));
            return res.status(200).json({id: id})

        } else if (req.method === 'GET') {
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