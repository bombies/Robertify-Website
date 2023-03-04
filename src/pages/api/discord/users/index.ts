import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ResponseBuilder} from "@/utils/api/api-utils";
import {DiscordUsersRedisManager} from "@/utils/api/redis/managers/discord-users.redis-manager";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

class RouteHandler extends MethodHandler {

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    async POST(): Promise<void> {
        return await this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async (req) => {
                const { id, data } = req.body;
                await new DiscordUsersRedisManager().putOne(id, data);
                return this.prepareResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, { id: id })
            })
            .execute();
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const routeHandler = new RouteHandler(req, res);
    return await routeHandler.handle([HTTPMethod.POST]);
}