import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import {AxiosError} from "axios";
import {NextRequest, NextResponse} from "next/server";
import {NextURL} from "next/dist/server/web/next-url";
import {Session, User} from "next-auth";
import {JsonWebTokenError, JwtPayload, verify} from "jsonwebtoken";
import {getToken} from "next-auth/jwt";
import WebClient from "@/utils/api/web-client";
import {DiscordUserGuild, isServerAdmin} from "@/utils/discord-types";

export class ResponseBuilder {
    private logicHandler?: (req: NextApiRequest, res: NextApiResponse, apiUtils: ApiUtils) => Promise<void>;
    private authenticatedRoute: boolean
    private predicate: { predicateFunc: (req: NextApiRequest, apiUtils: ApiUtils) => Promise<boolean>, failOptions?: { message: string, status: number } };
    private readonly apiUtils: ApiUtils;

    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
        this.authenticatedRoute = false;
        this.predicate = {predicateFunc: () => Promise.resolve(true)}
        this.apiUtils = new ApiUtils(req, res);
    }

    public setAuthenticatedRoute() {
        this.authenticatedRoute = true;
        return this;
    }

    public setServerAdminOnlyRoute() {
        this.predicate = {
            predicateFunc: async (req, utils) => {
                const getUserGuilds = async (session: User | null) => {
                    try {
                        if (!session)
                            return [];
                        return (await WebClient.getInstance(session)
                            .get(`/api/discord/user/guilds`)).data;
                    } catch (e: any) {
                        if (e instanceof AxiosError && e.response?.data.retry_after) {
                            setTimeout(() => {
                                getUserGuilds(session);
                            }, e.response.data.retry_after)
                        } else throw e;
                    }
                }

                const {body} = req;
                const {id} = req.query;
                if (!body.server_id && !id)
                    return false;

                const serverId = body.server_id ?? id;
                const session = await utils.getSession()
                if (!session)
                    return false;
                const userGuilds = (await getUserGuilds(session))?.data;
                return userGuilds ? isServerAdmin(userGuilds.filter((guild: DiscordUserGuild) => guild.id === serverId)[0]) : false;
            },
            failOptions: {status: StatusCodes.FORBIDDEN, message: 'You do not have permission to do this!'}
        }
        return this;
    }

    public setPredicate(predicate: (req: NextApiRequest, apiUtils: ApiUtils) => Promise<boolean>, failOptions?: { message: string, status: number }) {
        this.predicate = {predicateFunc: predicate, failOptions};
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
            if (this.authenticatedRoute && !(await this.apiUtils.isAuthenticated()))
                return this.apiUtils.prepareUnauthorizedResponse({reason: 'You are not authenticated.'});
            if (!await this.predicate.predicateFunc(this.req, this.apiUtils))
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
                return this.apiUtils.prepareResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, ex);
            }
        }
    }
}

export default class ApiUtils {
    constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
    }

    public async isAuthenticated(): Promise<boolean> {
        const session = await this.getSession();
        return session ? !this.sessionIsExpired(session) : false;
    }

    public async getSession(): Promise<User | undefined> {
        if (!this.req.headers.session) {
            // Check if request is from browser
            const token = await getToken({req: this.req});
            if (token) {
                const session: User = JSON.parse(JSON.stringify(token));
                if (this.sessionIsExpired(session))
                    return undefined;
                return session;
            } else return undefined;
        }

        let decodedPayload: string | JwtPayload;

        try {
            decodedPayload = verify(this.req.headers.session as string, process.env.NEXTAUTH_SECRET!);
        } catch (e) {
            if (e instanceof JsonWebTokenError)
                return undefined;
            console.error(e);
            return undefined;
        }

        if (!decodedPayload)
            return undefined;
        const session: User = JSON.parse(JSON.stringify(decodedPayload));
        if (this.sessionIsExpired(session))
            return undefined;
        return session;
    }

    public sessionIsExpired(session?: User): boolean {
        if (!session)
            return true;
        const {exp} = session;
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
    constructor(private readonly req: NextRequest) {
    }

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
        return res.json({data: {}, status: StatusCodes.BAD_REQUEST, message: 'Invalid HTTP method!'});
    }
}