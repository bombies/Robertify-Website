import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {NextApiRequest, NextApiResponse} from "next";
import {ExternalWebClient} from "@/utils/api/web-client";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async POST(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setServerAdminOnlyRoute()
            .setLogic(async (req) => {
                const {id} = req.query;
                const externWebClient = ExternalWebClient.getInstance();
                if (!externWebClient)
                    return this.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, "The external Web Client is null!");
                const res = (await externWebClient.post(`/guild/${id}/reqchannel`))?.data;
                return this.prepareResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, res);
            })
            .execute();
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new RouteHandler(req,res).handle([HTTPMethod.POST])
}