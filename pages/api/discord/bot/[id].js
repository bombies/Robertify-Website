import { redis } from "../../../../utils/RedisClient";
import { robertifyAPI } from "../../../../utils/RobertifyAPI";

const HASH_NAME = "ROBERTIFY_GUILD";

export default function handler(req, res) {
    const verifyPassword = verifyMasterPassword(req);
    if (verifyPassword)
        return res.status(400).json(verifyPassword); 

    const { id } = req.query;
    if (!(/^\d{17,18}$/.test(id)))
        return res.status(400).json({ error: 'Invalid guild ID!' });

    if (req.method !== 'GET')
        res.status(400).json({ error: `Cannot ${req.method} this route!` });
    
    const cachedData = await redis.get(HASH_NAME + id);
    if (cachedData) // Cache hit
        return res.status(200).json(JSON.parse(cachedData));
    
    // Cache miss
    await robertifyAPI.setAccessToken();
    const fetchedData = await robertifyAPI.getGuildInfo(id);
    return res.status(200).json(fetchedData);
}