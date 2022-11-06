import {withSentry} from "@sentry/nextjs";
import {NextApiRequest, NextApiResponse} from "next";
import {robertifyAPI} from "../../../../utils/RobertifyAPI";

export function verifyMasterPassword(req: NextApiRequest) {
    const master_password = req.headers['master-password'];
    if (!master_password)
        return { message: 'Invalid authorization' };

    if (master_password !== process.env.API_MASTER_PASSWORD)
        return { message: 'Invalid authorization' };
    return null;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(400).json({ success: false, error: `You cannot ${req.method} this route!` });

    try {
        if (verifyMasterPassword(req))
            return res.status(400).json({ error: 'Invalid authorization'});

        const { id, guildId } = req.query;
        if (id !== '1' && id !== '2')
            return res.status(400).json({ success: false, error: `There is no such bot with ID ${id}`});

        const guildInfo = await robertifyAPI.getGuildInfo(guildId.toString(), id);
        return res.status(200).json(guildInfo);
    } catch (ex) {
        console.error(ex);
        return res.status(ex.response.status).json({ success: false, error: 'An internal error occurred!'})
    }
}

export default handler;

export const config = {
    api: {
        externalResolver: true,
    },
}