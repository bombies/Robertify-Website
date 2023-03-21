import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import {JsonWebTokenError, verify} from "jsonwebtoken";
import {AxiosError} from "axios";

export class ResponseBuilder {
    private logicHandler?: (req: NextApiRequest, res: NextApiResponse, apiUtils: ApiUtils) => Promise<void>;
    private adminRoute: boolean
    private readonly apiUtils: ApiUtils;
    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
        this.adminRoute = false;
        this.apiUtils = new ApiUtils(req, res);
    }

    public setAdminRoute() {
        this.adminRoute = true;
        return this;
    }

    public setLogic(logicCallback: (req: NextApiRequest, res: NextApiResponse, apiUtils: ApiUtils) => Promise<void>) {
        this.logicHandler = logicCallback;
        return this;
    }

    public async execute() {
        if (!this.logicHandler)
            throw new Error('The logic error for this Response is undefined!');
        try {
            if (this.adminRoute && !this.apiUtils.verifyJWT())
                return this.apiUtils.prepareUnauthorizedResponse({ reason: 'Invalid JWT' });
            return await this.logicHandler(this.req, this.res, this.apiUtils);
        } catch (ex) {
            if (ex instanceof AxiosError)
                return this.apiUtils.prepareResponse(ex.status ?? StatusCodes.BAD_REQUEST, ex.message ?? 'Something went wrong!', ex.response?.data)
            console.error(ex);
            return this.apiUtils.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }
}

export default class ApiUtils {
    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {}

    public verifyJWT() {
        const jwt = this.extractJWT();
        if (typeof jwt === 'undefined')
            return false;
        try {
            return !!verify(jwt, process.env.API_SECRET_KEY!);
        } catch (e) {
            if (e instanceof JsonWebTokenError)
                return false;
            console.error(e);
        }
    }

    public extractJWT() {
        const auth = this.req.headers.authorization;
        if (!auth || !auth.includes("Bearer "))
            return undefined;
        return auth.split("Bearer ")[1];
    }

    public prepareResponse(status: StatusCodes, message?: string, data?: any) {
        return this.res.status(status).json({data: data, status: status, message: message || 'There was no message provided.'});
    }

    public prepareUnauthorizedResponse(data?: any) {
        return this.prepareResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, data);
    }

    public static invalidMethod(res: NextApiResponse) {
        return res.json({ data: {}, status: StatusCodes.BAD_REQUEST, message: 'Invalid HTTP method!' });
    }
}

type ParamSearchObject = {
    searchParams: URLSearchParams,
    paramName: string,
    limit?: number,
    defaultResult?: string
}

export const getParamFromSearch = (options: ParamSearchObject): string => {
    const { searchParams, paramName, limit, defaultResult } = options;
    const result = searchParams.get(paramName);
    return result?.slice(0, limit ?? result?.length) ?? (defaultResult ?? '');
}