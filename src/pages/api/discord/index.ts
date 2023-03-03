import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import DiscordAccessRedisManager from "@/utils/api/redis/managers/discord-access.redis-manager";
import {HTTPMethod, MethodHandler} from "@/utils/api/MethodHandler";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    async GET(): Promise<void> {
        return await this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async (req) => {
                const { id } = req.body;
                const data = await new DiscordAccessRedisManager().findOne(id);
                return data ? this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, data) : this.prepareResponse(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
            })
            .execute();
    }

    async POST(): Promise<void> {
        return await this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async (req) => {
                const { id, data } = req.body;
                await new DiscordAccessRedisManager().putOne(id, data);
                return this.prepareResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, { id: id })
            })
            .execute();
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const routeHandler = new RouteHandler(req, res);
    return await routeHandler.handle([HTTPMethod.GET, HTTPMethod.POST]);
}