import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {sign} from "jsonwebtoken";
import {nanoid} from "nanoid";

class RouteHandler extends MethodHandler {

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    async POST(): Promise<void> {
        return this.getResponseBuilder()
            .setLogic(async (req, _, utils) => {
                const {body} = req;
                const {password} = body;
                if (!password)
                    return this.prepareResponse(401, "You must provide a password field in the body!");

                if (password !== process.env.API_MASTER_PASSWORD)
                    return utils.prepareUnauthorizedResponse();

                const token = sign({id: nanoid(6)}, process.env.API_SECRET_KEY!, {expiresIn: '5m', subject: 'admin'});
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, {access_token: token});
            })
            .execute();
    }

}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    return new RouteHandler(req, res).handle([HTTPMethod.POST])
}

export default handler;