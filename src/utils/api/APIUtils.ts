import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";

export class ResponseBuilder {
    private logicHandler?: (req: NextApiRequest, res: NextApiResponse, apiUtils: APIUtils) => Promise<void>;
    private adminRoute: boolean
    private apiUtils: APIUtils;
    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
        this.adminRoute = false;
        this.apiUtils = new APIUtils(req, res);
    }

    public setAdminRoute() {
        this.adminRoute = true;
        return this;
    }

    public setLogic(logicCallback: (req: NextApiRequest, res: NextApiResponse, apiUtils: APIUtils) => Promise<void>) {
        this.logicHandler = logicCallback;
        return this;
    }

    public async execute() {
        if (!this.logicHandler)
            throw new Error('The logic error for this Response is undefined!');
        try {
            if (this.adminRoute && !this.apiUtils.verifyMasterPassword())
                return this.apiUtils.prepareInvalidPasswordResponse();
            return await this.logicHandler(this.req, this.res, this.apiUtils);
        } catch (ex) {
            console.error(ex);
            return this.apiUtils.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }
}

export default class APIUtils {
    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {}

    public verifyMasterPassword() {
        const inputPass = this.req.headers.authorization;
        const masterPass = process.env.API_MASTER_PASSWORD;
        if (inputPass === masterPass)
            return true;
        else return false;
    }

    public prepareResponse(status: StatusCodes, message?: string, data?: any) {
        return this.res.json({data: data || {}, status: status, message: message || 'There was no message provided.'});
    }

    public prepareInvalidPasswordResponse() {
        return this.prepareResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
    }

    public static invalidMethod(res: NextApiResponse) {
        return res.json({ data: {}, status: StatusCodes.BAD_REQUEST, message: 'Invalid HTTP method!' });
    }
}