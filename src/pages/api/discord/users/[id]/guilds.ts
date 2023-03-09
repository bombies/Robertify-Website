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

export type DiscordGuildChannel = {
    name: string,
    type: number,
    topic?: string,
    bitrate?: number,
    user_limit?: number,
    rate_limit_per_user?: number,
    position: number,
    permission_overwrites: any[],
    parent_id?: string,
    nsfw?: boolean,
    rtc_region?: boolean,
    video_quality_mode?: boolean,
    default_auto_archive_duration?: number,
    default_reaction_emoji?: any;
    available_tags?: any[],
    default_sort_order?: number,
}

type DedicatedChannel = {
    message_id?: string,
    channel_id?: string,
    config?: {
        disconnect: boolean,
        play_pause: boolean,
        previous: boolean,
        rewind: boolean,
        stop: boolean,
        loop: boolean,
        skip: boolean,
        filters: boolean,
        favourite: boolean,
        shuffle: boolean
    },
    og_announcement_toggle?: boolean,
};

type RestrictedChannels = {
    voice_channels?: string[],
    text_channels?: string[]
};

type GuildPermissions = {
    0?: string[],
    1?: string[],
    2?: string[],
    3?: string[],
    4?: string[],
    5?: string[],
    users?: Object
};

type GuildToggles = {
    restricted_text_channels: boolean,
    restricted_voice_channels: boolean,
    announce_changelogs: boolean,
    "8ball": boolean,
    show_requester: boolean,
    vote_skips: boolean,
    announce_messages: boolean,
    polls: boolean,
    tips: boolean,
    global_announcements: boolean,
    log_toggles: {
        queue_add: boolean,
        track_move: boolean,
        track_loop: boolean,
        player_pause: boolean,
        track_vote_skip: boolean,
        queue_shuffle: boolean,
        player_resume: boolean,
        volume_change: boolean,
        track_seek: boolean,
        track_previous: boolean,
        track_skip: boolean,
        track_rewind: boolean,
        bot_disconnected: boolean,
        queue_remove: boolean,
        filter_toggle: boolean,
        player_stop: boolean,
        queue_loop: boolean,
        queue_clear: boolean,
        track_jump: boolean
    },
    dj_toggles: {
        "247": boolean,
        play: boolean,
        disconnect: boolean,
        favouritetracks: boolean,
        skip: boolean,
        seek: boolean,
        remove: boolean,
        karaoke: boolean,
        tremolo: boolean,
        search: boolean,
        loop: boolean,
        nightcore: boolean,
        join: boolean,
        lyrics: boolean,
        jump: boolean,
        vibrato: boolean,
        resume: boolean,
        move: boolean,
        nowplaying: boolean,
        previous: boolean,
        clear: boolean,
        skipto: boolean,
        "8d": boolean,
        pause: boolean,
        autoplay: boolean,
        volume: boolean,
        lofi: boolean,
        rewind: boolean,
        stop: boolean,
        shuffleplay: boolean,
        queue: boolean,
    }
};

type GuildBannedUser = {
    banned_id: String,
    banned_by: String,
    banned_until: String,
    banned_at: String
};

export type RobertifyGuild = {
    dedicated_channel: DedicatedChannel;
    restricted_channels: RestrictedChannels;
    prefix: string;
    permissions: GuildPermissions;
    toggles: GuildToggles;
    eight_ball: string[];
    announcement_channel: string;
    theme: string;
    server_id: string;
    banned_users: GuildBannedUser[];
    autoplay: boolean;
    log_channel: string;
    twenty_four_seven_mode: boolean;
    locale: string;
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