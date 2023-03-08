import {NextApiRequest, NextApiResponse} from "next";
import {HTTPMethod, MethodHandler} from "@/utils/api/method-handler";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import DiscordAccessRedisManager from "@/utils/api/redis/managers/discord-access.redis-manager";
import {DiscordWebClient} from "@/utils/api/web-client";

export type DiscordGuild = {
    id: string,
    name: string,
    icon?: string,
    splash?: string,
    discovery_splash?: string,
    owner_id: string,
    afk_channel_id?: string,
    afk_timeout: number,
    widget_enabled?: boolean,
    widget_channel_id?: string,
    verification_level: number,
    default_message_notifications: number,
    explicit_content_filter: number,
    roles: any[],
    emojis: any[],
    features: any[],
    mfa_level: number,
    application_id?: string,
    system_channel_id?: string,
    system_channel_flags: number,
    rules_channel_id?: string,
    max_presences?: number,
    max_members: number,
    vanity_url_code?: string,
    description?: string,
    banner?: string,
    premium_tier: number,
    premium_subscription_count: number,
    preferred_locale: string,
    public_updates_channel?: string,
    max_video_channel_users?: number,
    approximate_member_count: number,
    approximate_presence_count: number,
    welcome_screen?: any,
    nsfw_level: number,
    region?: string,
    hub_type?: any,
    stickers?: any[],
    nsfw?: boolean,
    channels: any[],
    premium_progress_bar_enabled: boolean,
    max_stage_video_channel_users?: number
}

export type DiscordUserGuild = {
    id: string,
    name: string,
    icon: string,
    owner: boolean,
    permissions: string,
    features: string[]
}

class RouteHandler extends MethodHandler {
    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res);
    }

    protected async GET(): Promise<void> {
        return this.getResponseBuilder()
            .setAdminRoute()
            .setLogic(async (req) => {
                const { id } = req.query;
                if (typeof id !== 'string')
                    return this.prepareResponse(StatusCodes.BAD_REQUEST, "The ID provided must be a string!");
                const discordAccessData = await new DiscordAccessRedisManager().findOne(id);

                if (!discordAccessData)
                    return this.prepareResponse(StatusCodes.NOT_FOUND,  "There is no access data!");

                const fetchedData = (
                    await DiscordWebClient.getInstance(discordAccessData.access_token)
                    .get('/users/@me/guilds')
                )?.data;
                return this.prepareResponse(StatusCodes.OK, ReasonPhrases.OK, fetchedData);
            })
            .execute();
    }
}

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    return new RouteHandler(req, res)
        .handle([HTTPMethod.GET]);
}