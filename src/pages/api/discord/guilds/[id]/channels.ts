import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {DiscordWebClient} from "@/utils/api/web-client";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async (req) => {
                const { id } = req.query;

                const guildInfo = (
                    await DiscordWebClient.getInstance()
                        .get(`/guilds/${id}/channels`)
                )?.data;

                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, guildInfo);
            })
            .execute();
    }

    protected async PATCH(): Promise<void> {
        return super.PATCH();
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new RouteHandler(req, res).handle([HTTPMethod.GET, HTTPMethod.PATCH])
}