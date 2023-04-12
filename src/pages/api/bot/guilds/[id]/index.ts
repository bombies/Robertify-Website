import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {fetchRobertifyGuildInfo, updateRobertifyGuildInfo} from "@/utils/api/api-methods";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setLogic(async (req, _, apiUtils) => {
                const {id} = req.query;
                const guildInfo = await fetchRobertifyGuildInfo(id as string, await apiUtils.getSession())
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, guildInfo);
            })
            .execute();
    }

    protected async POST(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setServerAdminOnlyRoute()
            .setLogic(async (req, _, apiUtils) => {
                const {id} = req.query;
                const {body} = req;

                if (!body)
                    return this.prepareResponse(StatusCodes.BAD_REQUEST, "A body must be provided!");
                const res = await updateRobertifyGuildInfo(id as string, body, await apiUtils.getSession());
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, res);
            })
            .execute();
    }
}

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
    return new RouteHandler(req, res).handle([HTTPMethod.GET, HTTPMethod.POST])
}

export default Handler