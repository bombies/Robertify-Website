import React from "react";
import {getServerSession, Session} from "next-auth";
import WebClient from "@/utils/api/web-client";
import {AxiosError} from "axios";
import Link from "next/link";
import GenericImage from "@/app/_components/GenericImage";
import backIcon from "../../../../public/go-back.svg";
import MiniContent from "@/components/MiniContent";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {GuildDashboardInfoProvider} from "@/app/dashboard/[id]/guild-info-context";
import {DiscordUserGuild, isServerAdmin} from "@/utils/discord-types";
import DashboardCategorySelector from "@/app/dashboard/[id]/dashboard-category-selector";

interface Props extends React.PropsWithChildren {
    params: { id: string }
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

export async function generateMetadata({params}: { params: { id: string } }) {
    const { id } = params;
    let guildInfo = await getDiscordGuildInfo(id, await getServerSession(authOptions));
    if (guildInfo?.data?.code === 10004)
        guildInfo = undefined;

    return {
        title: `Robertify - ${!guildInfo ? 'No Server' : guildInfo?.data.name }`
    }
}

export default async function GuildDashboardLayout({ children, params }: Props) {

    const serverSession = await getServerSession(authOptions);
    let discordGuildInfo = await getDiscordGuildInfo(params.id, serverSession);
    let discordGuildChannelInfo = await getDiscordGuildChannels(params.id, serverSession);
    let botGuildInfo = await getBotGuildInfo(params.id, serverSession);
    const userGuilds = (await getUserGuilds(serverSession))?.data;

    if (discordGuildInfo?.data?.code === 10004)
        discordGuildInfo = undefined;
    if (discordGuildChannelInfo?.data?.code === 50001)
        discordGuildChannelInfo = undefined;
    if (botGuildInfo?.data?.statusCode === 404)
        botGuildInfo = undefined

    const guildIcon = discordGuildInfo?.data.icon ? `https://cdn.discordapp.com/icons/${discordGuildInfo?.data.id}/${discordGuildInfo?.data.icon}.webp?size=512` : 'https://i.imgur.com/k14Qfh5.png';

    return (
        <div className='w-full min-h-screen desktop:p-36 p-24 tablet:px-6 phone:px-3'>
            <div className='tablet:px-6 px+-12'>
                <Link href='/dashboard'>
                    <div className='flex gap-4 hover:scale-[100.25%] transition-fast mb-6'>
                        <GenericImage src={backIcon} width={2}/>
                        <p className='relative self-center text-primary font-semibold text-xl phone:text-sm'>Return to
                            your servers</p>
                    </div>
                </Link>
            </div>
            <div
                className='relative overflow-hidden mx-auto mb-12 tablet:p-6 p-8 bg-primary/10 shadow-md dark:bg-neutral-900 w-full h-42 rounded-2xl border-2 border-primary/90'
            >
                <div className='flex gap-12'>
                    <GenericImage
                        className='relative w-20 h-20 phone:w-16 phone:h-16 rounded-full'
                        imageClassName='rounded-full'
                        src={guildIcon}
                    />
                    <h1 className='text-4xl phone:text-xl font-black tracking-wider text-primary self-center z-10'>{discordGuildInfo?.data.name}</h1>
                    <MiniContent content='BETA' />
                </div>
            </div>
            <GuildDashboardInfoProvider initialDashboardInfo={{
                discordGuild: discordGuildInfo?.data,
                discordGuildChannels: discordGuildChannelInfo?.data,
                robertifyGuild: botGuildInfo?.data,
                userHasPermission: userGuilds ? isServerAdmin(userGuilds.filter((guild: DiscordUserGuild) => guild.id === params.id)[0]) : false
            }}>
                <DashboardCategorySelector />
                {children}
            </GuildDashboardInfoProvider>
        </div>
    )
}