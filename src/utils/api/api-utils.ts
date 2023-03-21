import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import {JsonWebTokenError, verify} from "jsonwebtoken";
import {AxiosError} from "axios";
import {NextRequest, NextResponse} from "next/server";
import WebClient from "@/utils/api/web-client";
import {NextURL} from "next/dist/server/web/next-url";

export class ResponseBuilder {
    private logicHandler?: (req: NextApiRequest, res: NextApiResponse, apiUtils: ApiUtils) => Promise<void>;
    private authenticatedRoute: boolean
    private readonly apiUtils: ApiUtils;
    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
        this.authenticatedRoute = false;
        this.apiUtils = new ApiUtils(req, res);
    }

    public setAuthenticatedRoute() {
        this.authenticatedRoute = true;
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
            console.log("is auth", await this.apiUtils.isAuthenticated())
            if (this.authenticatedRoute && !(await this.apiUtils.isAuthenticated()))
                return this.apiUtils.prepareUnauthorizedResponse({ reason: 'You are not authenticated.' });
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

    public async isAuthenticated(): Promise<boolean> {
        const webClient = WebClient.getInstance();
        try {
            const data = (await webClient.get("/api/@me")).data;
            return !!data;
        } catch (e) {
            if (e instanceof AxiosError && (e.response?.status === 403 || e.response?.status === 404))
                return false;
            console.error(e);
            return false;
        }
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

export class AppApiUtils {
    constructor(private readonly req: NextRequest) {}

    public redirect(url: string | URL | NextURL, init?: ResponseInit) {
        return NextResponse.redirect(new URL(url, this.req.url), init)
    }

    public prepareResponse(status: StatusCodes, message?: string, data?: any) {
        return NextResponse.json({data: data, status: status, message: message || 'There was no message provided.'}, {
            status: status,
            statusText: message || 'There was no text provided'
        });
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