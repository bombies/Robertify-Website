import { GUILD_HASH } from ".";
import { verifyMasterPassword } from "..";
import { redis } from "../../../../../utils/RedisClient";

export default async function handler(req, res) {
    try {
        if (req.method !== 'GET')
            return res.send(400).json({ message: `You can't ${req.method} this route!`})

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