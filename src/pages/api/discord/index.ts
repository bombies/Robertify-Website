import {ReasonPhrases, StatusCodes} from "http-status-codes";
import APIUtils, { ResponseBuilder } from "../../../utils/api/APIUtils";
import { DiscordUsersRedisManager } from "../../../utils/api/redis/managers/discord-users.redis-manager";
import {NextApiRequest, NextApiResponse} from "next";

async function POST(req: NextApiRequest, res: NextApiResponse) {
    return await new ResponseBuilder(req, res)
        .setAdminRoute()
        .setLogic(async (req, res, apiUtils) => {
            const { id, data } = req.body;
            await new DiscordUsersRedisManager().putOne(id, data);
            return apiUtils.prepareResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, { id: id})
        })
        .execute();
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    return await new ResponseBuilder(req, res)
        .setAdminRoute()
        .setLogic(async (req, res, apiUtils) => {
            const { id } = req.body;
            try {
                const data = await new DiscordUsersRedisManager().findOne(id);
                return apiUtils.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, data)
            } catch (ex) {
                return apiUtils.prepareResponse(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
            }
        })
        .execute();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST': {
            return await POST(req, res);
        }
        case 'GET': {
            return await GET(req, res);
        }
        default: {
            return APIUtils.invalidMethod(res);
        }
    }
}