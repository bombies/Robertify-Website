import {NextApiRequest, NextApiResponse} from "next";
import ApiUtils, {ResponseBuilder} from "@/utils/api/api-utils";
import {StatusCodes} from "http-status-codes";

export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export abstract class MethodHandler {
    private apiUtils: ApiUtils;

    protected constructor(private readonly req: NextApiRequest, private readonly res: NextApiResponse) {
        this.apiUtils = new ApiUtils(req, res);
    }

    protected async GET(): Promise<void> {
        return
    };

    protected async POST(): Promise<void> {
        return
    };

    protected async PATCH(): Promise<void> {
        return
    };

    protected async DELETE(): Promise<void> {
        return
    };

    public getResponseBuilder() {
        return new ResponseBuilder(this.req, this.res);
    }

    public prepareResponse(status: StatusCodes, message?: string, data?: any) {
        return this.apiUtils.prepareResponse(status, message, data);
    }

    private invalidMethod() {
        return ApiUtils.invalidMethod(this.res);
    }

    public async handle(allowedMethods: HTTPMethod[]) {
        if (allowedMethods.find(method => method === this.req.method)) {
            switch (this.req.method) {
                case HTTPMethod.GET: {
                    return await this.GET();
                }
                case HTTPMethod.POST: {
                    return await this.POST();
                }
                case HTTPMethod.PATCH: {
                    return await this.PATCH();
                }
                case HTTPMethod.DELETE: {
                    return await this.DELETE();
                }
            }
        } else return this.invalidMethod();
    }
}