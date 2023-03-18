import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import DiscordAccessRedisManager from "@/utils/api/redis/managers/discord-access.redis-manager";
import {DiscordWebClient} from "@/utils/api/web-client";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async (req) => {
                const { id } = req.query;
                if (typeof id !== 'string')
                    return this.prepareResponse(StatusCodes.BAD_REQUEST, "The ID provided must be a string!");
                const discordAccessData = await new DiscordAccessRedisManager().findOne(id);

                if (!discordAccessData)
                    return this.prepareResponse(StatusCodes.NOT_FOUND,  "There is no access data!");

                const fetchedData = (
                    await DiscordWebClient.getInstance(discordAccessData.access_token)
                    .get('/users/@me/guilds')
                )?.data;
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, fetchedData);
            })
            .execute();
    }
}

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    return new RouteHandler(req, res)
        .handle([HTTPMethod.GET]);
}