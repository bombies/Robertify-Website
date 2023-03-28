import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {fetchDiscordGuildInfo} from "@/utils/api/api-methods";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setLogic(async (req, _, apiUtils) => {
                const { id } = req.query;

                const guildInfo = fetchDiscordGuildInfo(id as string, await apiUtils.getSession())

                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, guildInfo);
            })
            .execute();
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new RouteHandler(req, res).handle([HTTPMethod.GET])
}