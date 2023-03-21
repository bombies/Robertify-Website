import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import {AxiosError} from "axios";
import {NextRequest, NextResponse} from "next/server";
import {NextURL} from "next/dist/server/web/next-url";
import {Session} from "next-auth";

export class ResponseBuilder {
    private logicHandler?: (req: NextApiRequest, res: NextApiResponse, apiUtils: ApiUtils) => Promise<void>;
    private authenticatedRoute: boolean
    private predicate: {predicateFunc: () => boolean, failOptions?: { message: string, status: number }};
    private readonly apiUtils: ApiUtils;

    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
        this.authenticatedRoute = false;
        this.predicate = {predicateFunc: () => true}
        this.apiUtils = new ApiUtils(req, res);
    }

    public setAuthenticatedRoute() {
        this.authenticatedRoute = true;
        return this;
    }

    public setPredicate(predicate: () => boolean, failOptions?: { message: string, status: number }) {
        this.predicate = { predicateFunc: predicate, failOptions };
    }

    public setLogic(logicCallback: (req: NextApiRequest, res: NextApiResponse, apiUtils: ApiUtils) => Promise<void>) {
        this.logicHandler = logicCallback;
        return this;
    }

    public async execute(): Promise<void> {
        if (!this.logicHandler)
            throw new Error('The logic error for this Response is undefined!');
        try {
            if (this.authenticatedRoute && !(await this.apiUtils.isAuthenticated()))
                return this.apiUtils.prepareUnauthorizedResponse({ reason: 'You are not authenticated.' });
            if (!this.predicate.predicateFunc())
                return this.apiUtils.prepareResponse(this.predicate.failOptions?.status || StatusCodes.BAD_REQUEST, this.predicate.failOptions?.message || 'Predicate check failed!');
            return await this.logicHandler(this.req, this.res, this.apiUtils);
        } catch (ex) {
            if (ex instanceof AxiosError) {
                if (ex.response?.data.retry_after) {
                    setTimeout(async () => {
                        return await this.execute();
                    }, ex.response?.data.retry_after * 1000)
                } else return this.apiUtils.prepareResponse(ex.response?.status ?? StatusCodes.BAD_REQUEST, ex.message ?? 'Something went wrong!', ex.response?.data)
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

    public async isAuthenticated(): Promise<boolean> {
        const session = this.getSession();
        return session ? !this.sessionIsExpired(session) : false;
    }

    public getSession(): Session | undefined {
        if (!this.req.headers.session)
            return undefined;
        return JSON.parse(this.req.headers.session as string)
    }

    public sessionIsExpired(session: Session): boolean {
        if (!session?.user)
            return true;
        const { exp } = session.user;
        return Number(exp) - new Date().getSeconds() <= 0;
    }

    public prepareResponse(status: StatusCodes, message?: string, data?: any) {
        return this.res.status(status).json({
            data: data,
            status: status,
            message: message || 'There was no message provided.'
        });
    }

    public prepareUnauthorizedResponse(data?: any) {
        return this.prepareResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, data);
    }

    public static invalidMethod(res: NextApiResponse) {
        return res.json({data: {}, status: StatusCodes.BAD_REQUEST, message: 'Invalid HTTP method!'});
    }
}

export class AppApiUtils {
    constructor(private readonly req: NextRequest) {}

    public async isAuthenticated(): Promise<boolean> {
        const session = this.getSession();
        return !!session;
    }

    public getSession(): Session | undefined {
        if (!this.req.headers.get("session"))
            return undefined;
        return JSON.parse(this.req.headers.get("session") as string)
    }

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
    const {searchParams, paramName, limit, defaultResult} = options;
    const result = searchParams.get(paramName);
    return result?.slice(0, limit ?? result?.length) ?? (defaultResult ?? '');
}