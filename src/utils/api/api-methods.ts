import {User} from "next-auth";
import {DiscordWebClient, ExternalWebClient} from "@/utils/api/web-client";
import {
    RequestChannel,
    DiscordGuild,
    DiscordGuildChannel,
    DiscordGuildMember,
    DiscordUserGuild,
    RobertifyGuild
} from "@/utils/discord-types";

export const createReqChannel = async (id: string, session?: User | null): Promise<RequestChannel> => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await ExternalWebClient.getInstance().post(`/guild/${id}/reqchannel`);
    return data.data;
}

export const deleteReqChannel = async (id: string, session?: User | null) => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await ExternalWebClient.getInstance().delete(`/guild/${id}/reqchannel`);
    return data.data;
}

export const fetchRobertifyGuildInfo = async (id: string, session?: User | null): Promise<RobertifyGuild> => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await ExternalWebClient.getInstance()
        .get(`/guild/${id}`);
    return data.data;
}

export const updateRobertifyGuildInfo = async (id: string, body: Partial<RobertifyGuild>, session?: User | null) => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await ExternalWebClient.getInstance().patch(`/guild/${id}`, body);
    return data.data;
}

export const fetchDiscordUserGuilds = async (session?: User | null): Promise<DiscordUserGuild[]> => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await DiscordWebClient.getInstance(session!.access_token)
        .get('/users/@me/guilds')
    return data.data;
}

export const fetchDiscordGuildMember = async (guildId: string, session?: User | null): Promise<DiscordGuildMember> => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await DiscordWebClient.getInstance()
        .get(`/guilds/${guildId}/members/${session.id}`)
    return data.data;
}

export const fetchDiscordGuildChannels = async (id: string, session?: User | null): Promise<DiscordGuildChannel[]> => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await DiscordWebClient.getInstance()
        .get(`/guilds/${id}/channels`);
    return data.data;
}

export const fetchDiscordGuildInfo = async (id: string, session?: User | null): Promise<DiscordGuild> => {
    if (!session)
        throw new Error('You are not authenticated!');
    const data = await DiscordWebClient.getInstance()
        .get(`/guilds/${id}`);
    return data.data;
}