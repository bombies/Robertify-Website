import { USER_HASH, verifyMasterPassword } from ".";
import { redis } from "../../../../utils/RedisClient";

export default async function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(400).json({ error: `You cannot ${req.method} this route!` })

    const verifyPassword = verifyMasterPassword(req);
    if (verifyPassword)
        return res.status(400).json(verifyPassword);

    const { id } = req.query;

    const userData = await redis.hget(USER_HASH, id);
    if (!userData)
        return res.status(200).json(null);
    res.status(200).json(JSON.parse(userData));
}