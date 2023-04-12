import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {fetchDiscordGuildMember} from "@/utils/api/api-methods";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAuthenticatedRoute()
            .setLogic(async (req, _, apiUtils) => {
                const {id} = req.query;
                const memberInfo = await fetchDiscordGuildMember(id as string, await apiUtils.getSession());
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, memberInfo);
            })
            .execute();
    }
}

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
    return new RouteHandler(req, res).handle([HTTPMethod.GET]);
}

export default Handler