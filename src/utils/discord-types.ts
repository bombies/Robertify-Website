export type DiscordRole = {
    id: string,
    name: string,
    color: number,
    hoist: boolean,
    icon?: string | null,
    unicode_emoji?: string | null,
    position: number,
    permissions: string,
    managed: boolean,
    mentionable: boolean,
    tags?: any
}

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
    roles: DiscordRole[],
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
    id: string,
    type: number,
    guild_id?: string,
    position?: number,
    permission_overwrites?: { id: string, type: number, allow: string, deny: string }[],
    name?: string,
    topic?: string,
    nsfw?: boolean,
    last_message_id?: string,
    bitrate?: number,
    user_limit?: number,
    rate_limit_per_user?: number,
    recipients?: any[],
    icon?: string,
    owner_id?: string,
    application_id?: string,
    managed?: boolean,
    parent_id?: string,
    last_pin_timestamp?: Date,
    rtc_region?: string,
    video_quality_mode?: string,
    message_count?: number,
    member_count?: number,
    thread_metadata?: any,
    member?: any,
    default_auto_archive_duration?: number,
    permissions?: string,
    flags?: number,
    total_message_sent?: number,
    available_tags?: any[],
    applied_tags?: string[],
    default_reaction_emoji?: any,
    default_thread_rate_limit_per_user?: number,
    default_sort_order?: number,
    default_forum_layout?: number,
}

export type RequestChannel = {
    message_id?: string,
    channel_id?: string,
    config?: RequestChannelConfig,
    og_announcement_toggle?: boolean,
};

export type RequestChannelConfig = {
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
}

export type RestrictedChannels = {
    voice_channels?: string[],
    text_channels?: string[]
};

export type GuildPermissions = {
    0?: string[],
    1?: string[],
    2?: string[],
    3?: string[],
    4?: string[],
    5?: string[],
    users?: Object
};

export type GuildDJToggles = {
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

export type GuildLogToggles = {
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
}

export type GuildToggles = {
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
    reminders?: boolean,
    log_toggles?: GuildLogToggles,
    dj_toggles: GuildDJToggles
};

type GuildBannedUser = {
    banned_id: String,
    banned_by: String,
    banned_until: String,
    banned_at: String
};

export type LocaleString = "english" | "spanish" | "portuguese" | "russian" | "dutch" | "german" | "french";
export type ThemeString =
    "green"
    | "gold"
    | "red"
    | "yellow"
    | "orange"
    | "dark"
    | "light"
    | "blue"
    | "light_blue"
    | "lightblue"
    | "pink"
    | "purple"
    | "mint"
    | "pastel_yellow"
    | "pastel_purple"
    | "pastel_red"
    | "baby_blue"

export type RobertifyGuild = {
    dedicated_channel: RequestChannel;
    restricted_channels: RestrictedChannels;
    prefix: string;
    permissions: GuildPermissions;
    toggles: GuildToggles;
    eight_ball: string[];
    announcement_channel: string;
    theme: ThemeString;
    server_id: string;
    banned_users: GuildBannedUser[];
    autoplay: boolean;
    log_channel: string;
    twenty_four_seven_mode: boolean;
    locale: LocaleString;
};

export type DiscordUserGuild = {
    id: string,
    name: string,
    icon: string,
    owner: boolean,
    permissions: string,
    features: string[]
};

export type DiscordUser = {
    id: string,
    username: string,
    discriminator: string,
    avatar?: string,
    bot?: boolean,
    system?: boolean,
    mfa_enabled?: boolean,
    banner?: string,
    accent_color?: number,
    locale?: string,
    verified?: boolean,
    email?: string,
    flags?: number,
    premium_type?: number,
    public_flags?: number,
};

export type DiscordGuildMember = {
    user?: DiscordUser,
    nick?: string,
    avatar?: string,
    roles?: string[],
    joined_at: string,
    premium_since?: string,
    deaf: boolean,
    mute: boolean,
    flags: number,
    pending?: boolean,
    permissions?: string,
    communication_disabled_until?: string,
};

export function isServerAdmin(guild: DiscordUserGuild): boolean {
    if (!guild) return false;
    return guild.owner || permContainsAdmin(guild.permissions);
}

export function isGuildAdmin(member: DiscordGuildMember, guildInfo: DiscordGuild): boolean {
    if (!member || !guildInfo) return false;

    if (member.user && (member.user.id === guildInfo.owner_id))
        return true;

    const userCheck = permContainsAdmin(member.permissions);
    if (userCheck)
        return true;

    const memberRoles = member.roles
    if (!memberRoles || memberRoles.length == 0)
        return false;

    if (!guildInfo.roles)
        return false;

    const roleDetails = guildInfo.roles.filter(role => memberRoles.some(r => r === role.id));
    for (let i = 0; i < roleDetails.length; i++)
        if (permContainsAdmin(roleDetails[i].permissions))
            return true;
    return false;
}

function permContainsAdmin(perm?: string) {
    if (!perm) return false;
    return (Number(perm) & (1 << 5)) === (1 << 5) || (Number(perm) & (1 << 3)) === (1 << 3)
}