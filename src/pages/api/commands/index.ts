import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {ExternalWebClient} from "@/utils/api/web-client";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setLogic(async () => {
                const externWebClient = ExternalWebClient.getInstance();
                if (!externWebClient)
                    return this.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, "The external Web Client is null!");
                const data = (await externWebClient.get('/commands')).data;
                if (!data)
                    return this.prepareResponse(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, data);
            })
            .execute();
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const routeHandler = new RouteHandler(req, res);
    return routeHandler.handle([HTTPMethod.GET]);
}