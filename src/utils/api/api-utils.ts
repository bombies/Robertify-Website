import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
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

    public async execute(): Promise<void> {
        if (!this.logicHandler)
            throw new Error('The logic error for this Response is undefined!');
        try {
            if (this.adminRoute && !this.apiUtils.verifyMasterPassword())
                return this.apiUtils.prepareInvalidPasswordResponse();
            return await this.logicHandler(this.req, this.res, this.apiUtils);
        } catch (ex) {
            if (ex instanceof AxiosError) {
                if (ex.response?.data.retry_after) {
                    setTimeout(async () => {
                        return await this.execute();
                    }, ex.response?.data.retry_after * 1000)
                } else return this.apiUtils.prepareResponse(ex.status || 500, ex.message, ex.response?.data)
            } else {
                console.error(ex);
                return this.apiUtils.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default class ApiUtils {
    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
    }

    public verifyMasterPassword() {
        const inputPass = this.req.headers.authorization;
        const masterPass = process.env.API_MASTER_PASSWORD;
        return inputPass === masterPass;
    }

    public prepareResponse(status: StatusCodes, message?: string, data?: any) {
        return this.res.json({data: data, status: status, message: message || 'There was no message provided.'});
    }

    public prepareInvalidPasswordResponse() {
        return this.prepareResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
    }

    public static invalidMethod(res: NextApiResponse) {
        return res.json({data: {}, status: StatusCodes.BAD_REQUEST, message: 'Invalid HTTP method!'});
    }
}

type ParamSearchObject = {
    searchParams: URLSearchParams,
    paramName: string,
    limit?: number,
    defaultResult?: string
}

export const getParamFromSearch = (options: ParamSearchObject): string => {
    const {searchParams, paramName, limit, defaultResult} = options;
    const result = searchParams.get(paramName);
    return result?.slice(0, limit ?? result.length) ?? (defaultResult ?? '');
}