import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import DiscordAccessRedisManager from "@/utils/api/redis/managers/discord-access.redis-manager";
import {DiscordUsersRedisManager} from "@/utils/api/redis/managers/discord-users.redis-manager";
import WebClient, {DiscordWebClient} from "@/utils/api/web-client";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    async GET(): Promise<void> {
        return await this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async (req) => {
                const { id } = req.query;
                if (typeof id !== 'string')
                    return this.prepareResponse(StatusCodes.BAD_REQUEST, "The ID provided must be a string!");
                const discordAccessData = await new DiscordAccessRedisManager().findOne(id);

                if (!discordAccessData)
                    return this.prepareResponse(StatusCodes.NOT_FOUND,  "There is no access data!");


                const usersRedisManager = new DiscordUsersRedisManager();
                const discordUserData = await usersRedisManager.findOne(id);
                // A beautiful cache hit
                if (discordUserData)
                    return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, discordUserData);

                // A not so beautiful cache miss
                // Contacting Discord's API for the data.
                const fetchedData = (await (await DiscordWebClient.getInstance(discordAccessData.access_token))
                    .get('/users/@me'))?.data;

                // Storing fetchedData in cache
                await usersRedisManager.putOne(id, fetchedData);
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, fetchedData);
            })
            .execute();
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const routeHandler = new RouteHandler(req, res);
    return await routeHandler.handle([HTTPMethod.GET]);
}