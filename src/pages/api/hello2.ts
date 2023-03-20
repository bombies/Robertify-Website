import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {NextApiRequest, NextApiResponse} from "next";
import {StatusCodes} from "http-status-codes";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async () => {
                return this.prepareResponse(StatusCodes.OK, "Hello there! You are verified :D");
            })
            .execute();
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new RouteHandler(req, res).handle([HTTPMethod.GET])
}