import WebClient from "@/utils/api/web-client";
import GuildDashboardContext from "@/app/dashboard/[id]/guild-dashboard-context";
import {AxiosError} from "axios";
import {DiscordUserGuild, isServerAdmin} from "@/utils/discord-types";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export const metadata = {
    title: `Robertify - Guild Dashboard`
}

const getDiscordGuildInfo = async (id: string, session: Session | null) => {
    try {
        return (await WebClient.getInstance(session?.user)
            .get(`/api/discord/guilds/${id}`))?.data
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 404)
                return undefined;
        }
    }

}

const getDiscordGuildChannels = async (id: string, session: Session | null) => {
    try {
        return (await WebClient.getInstance(session?.user)
            .get(`/api/discord/guilds/${id}/channels`))?.data
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 404)
                return undefined;
        }
    }
}

const getBotGuildInfo = async (id: string, session: Session | null) => {
    try {
        return (await WebClient.getInstance(session?.user)
            .get(`/api/bot/guilds/${id}`))?.data
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 404)
                return undefined;
        }
    }
}

const getUserGuilds = async (session: Session | null) => {
    try {
        if (!session?.user)
            return [];
        return (await WebClient.getInstance(session?.user)
            .get(`/api/discord/user/guilds`))?.data;
    } catch (e: any) {
        if (e instanceof AxiosError && e.response?.data.retry_after) {
            setTimeout(() => {
                getUserGuilds(session);
            }, e.response.data.retry_after)
        } else throw e;
    }
}

export default async function GuildDashboard({ params }: { params: { id: string }}) {
    const { id } = params;
    const serverSession = await getServerSession(authOptions);
    let discordGuildInfo = await getDiscordGuildInfo(id, serverSession);
    let discordGuildChannelInfo = await getDiscordGuildChannels(id, serverSession);
    let botGuildInfo = await getBotGuildInfo(id, serverSession);
    const userGuilds = (await getUserGuilds(serverSession))?.data;

    if (discordGuildInfo?.data?.code === 10004)
        discordGuildInfo = undefined;
    if (discordGuildChannelInfo?.data?.code === 50001)
        discordGuildChannelInfo = undefined;
    if (botGuildInfo?.data?.statusCode === 404)
        botGuildInfo = undefined

    return (
        <main className='w-full min-h-screen desktop:p-36 p-24 tablet:px-6 phone:px-3'>
            <GuildDashboardContext
                id={id}
                discordGuildInfo={discordGuildInfo?.data}
                discordGuildChannels={discordGuildChannelInfo?.data}
                robertifyGuildInfo={botGuildInfo?.data}
                userHasPermission={userGuilds ? isServerAdmin(userGuilds.filter((guild: DiscordUserGuild) => guild.id === id)[0])  : false}
            />
        </main>
    )
}