import WebClient from "@/utils/api/web-client";
import GuildDashboardContext from "@/app/dashboard/[id]/guild-dashboard-context";

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

export default async function GuildDashboard({ params }: { params: { id: string }}) {
    const { id } = params;
    let discordGuildInfo = await getDiscordGuildInfo(id);
    let discordGuildChannelInfo = await getDiscordGuildChannels(id);
    let botGuildInfo = await getBotGuildInfo(id);

    if (discordGuildInfo.data.code === 10004)
        discordGuildInfo = undefined;
    if (discordGuildChannelInfo.data.code === 50001)
        discordGuildChannelInfo = undefined;
    if (botGuildInfo.data.statusCode === 404)
        botGuildInfo = undefined

    // Update

    return (
        <main className='w-full min-h-screen p-24 tablet:px-6 phone:px-3'>
            <GuildDashboardContext
                id={id}
                discordGuildInfo={discordGuildInfo?.data}
                discordGuildChannels={discordGuildChannelInfo?.data}
                robertifyGuildInfo={botGuildInfo?.data}
            />
        </main>
    )
}