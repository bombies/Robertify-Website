import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import WebClient, {ExternalWebClient} from "@/utils/api/web-client";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {Session, User} from "next-auth";
import {AxiosError} from "axios";
import {DiscordUserGuild, isServerAdmin} from "@/utils/discord-types";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setLogic(async (req) => {
                const {id} = req.query;
                const externWebClient = ExternalWebClient.getInstance();
                if (!externWebClient)
                    return this.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, "The external Web Client is null!");

                const guildInfo = (
                    await externWebClient
                        .get(`/guild/${id}`)
                )?.data;

                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, guildInfo);
            })
            .execute();
    }

    protected async POST(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setServerAdminOnlyRoute()
            .setLogic(async (req) => {
                const {id} = req.query;
                const {body} = req;
                const externWebClient = ExternalWebClient.getInstance();
                if (!externWebClient)
                    return this.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, "The external Web Client is null!");

                if (!body)
                    return this.prepareResponse(StatusCodes.BAD_REQUEST, "A body must be provided!");
                const res = (await externWebClient.patch(`/guild/${id}`, body))?.data;
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, res);
            })
            .execute();
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new RouteHandler(req, res).handle([HTTPMethod.GET, HTTPMethod.POST])
}