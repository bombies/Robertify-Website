import WebClient from "@/utils/api/web-client";
import GuildDashboardContext from "@/app/dashboard/[id]/guild-dashboard-context";
import {AxiosError} from "axios";
import {cookies} from "next/headers";
import {DiscordUserGuild, isServerAdmin} from "@/utils/discord-types";

const getDiscordGuildInfo = async (id: string) => {
    return (await WebClient.getInstance()
        .get(`/api/discord/guilds/${id}`))?.data
}

const getDiscordGuildChannels = async (id: string) => {
    return (await WebClient.getInstance()
        .get(`/api/discord/guilds/${id}/channels`))?.data
}

const getBotGuildInfo = async (id: string) => {
    return (await WebClient.getInstance()
        .get(`/api/bot/guilds/${id}`))?.data
}

const getUserGuilds = async (token?: string) => {
    try {
        return (await WebClient.getInstance()
            .get(`/api/discord/users/${token}/guilds`))?.data;
    } catch (e: any) {
        if (e instanceof AxiosError && e.response?.data.retry_after) {
            setTimeout(() => {
                getUserGuilds(token);
            }, e.response.data.retry_after)
        } else throw e;
    }
}

export default async function GuildDashboard({ params }: { params: { id: string }}) {
    const { id } = params;
    let discordGuildInfo = await getDiscordGuildInfo(id);
    let discordGuildChannelInfo = await getDiscordGuildChannels(id);
    let botGuildInfo = await getBotGuildInfo(id);
    const token = cookies().get('login-token')?.value;
    const userGuilds = (await getUserGuilds(token))?.data;

    if (discordGuildInfo.data?.code === 10004)
        discordGuildInfo = undefined;
    if (discordGuildChannelInfo.data?.code === 50001)
        discordGuildChannelInfo = undefined;
    if (botGuildInfo.data?.statusCode === 404)
        botGuildInfo = undefined

    const apiMasterPassword = process.env.API_MASTER_PASSWORD;

    return (
        <main className='w-full min-h-screen desktop:p-36 p-24 tablet:px-6 phone:px-3'>
            <GuildDashboardContext
                id={id}
                discordGuildInfo={discordGuildInfo?.data}
                discordGuildChannels={discordGuildChannelInfo?.data}
                robertifyGuildInfo={botGuildInfo?.data}
                apiMasterPassword={apiMasterPassword}
                userHasPermission={userGuilds ? isServerAdmin(userGuilds.filter((guild: DiscordUserGuild) => guild.id === id)[0])  : false}
            />
        </main>
    )
}