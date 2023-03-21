import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {JsonWebTokenError, sign, verify} from "jsonwebtoken";
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

                if (!this.verifyPassword(password))
                    return utils.prepareUnauthorizedResponse();

                const token = sign({id: nanoid(6)}, process.env.API_SECRET_KEY!, {expiresIn: '5m', subject: 'admin'});
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, {access_token: token});
            })
            .execute();
    }

    private verifyPassword(password: string) {
        if (!password)
            return false;
        try {
            return !!verify(password, process.env.API_SECRET_KEY!);
        } catch (e) {
            if (e instanceof JsonWebTokenError)
                return false;
            console.error(e);
        }
    }

}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    return new RouteHandler(req, res).handle([HTTPMethod.POST])
}

export default handler;