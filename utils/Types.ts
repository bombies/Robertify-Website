export type DiscordInfo = {
    id: string,
    username: string,
    bot?: boolean,
    system?: boolean,
    mfa_enabled?: boolean,
    banner?: string | null,
    accent_color?: number | null,
    locale?: string,
    verified?: boolean,
    email?: string | null,
    flags?: number,
    premium_type?: number,
    avatar: string,
    avatar_decoration: string | null
    discriminator: string,
    public_flags?: number,
}