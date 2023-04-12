import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {NextApiRequest, NextApiResponse} from "next";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {createReqChannel, deleteReqChannel} from "@/utils/api/api-methods";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async POST(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setServerAdminOnlyRoute()
            .setLogic(async (req, _, apiUtils) => {
                const {id} = req.query;
                const res = await createReqChannel(id as string, await apiUtils.getSession());
                return this.prepareResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, res);
            })
            .execute();
    }

    protected async DELETE(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setServerAdminOnlyRoute()
            .setLogic(async (req, _, apiUtils) => {
                const {id} = req.query;
                const res = await deleteReqChannel(id as string, await apiUtils.getSession());
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, res);
            })
            .execute();
    }
}

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
    return new RouteHandler(req, res).handle([HTTPMethod.POST, HTTPMethod.DELETE])
}

export default Handler