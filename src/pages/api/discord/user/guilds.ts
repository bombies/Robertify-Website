import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {fetchDiscordUserGuilds} from "@/utils/api/api-methods";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setLogic(async (req, _, apiUtils) => {
                const session = await apiUtils.getSession();
                const fetchedData = await fetchDiscordUserGuilds(session);
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, fetchedData);
            })
            .execute();
    }
}

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
    return new RouteHandler(req, res)
        .handle([HTTPMethod.GET]);
}

export default Handler