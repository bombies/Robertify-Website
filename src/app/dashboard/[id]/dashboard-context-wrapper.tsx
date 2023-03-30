'use client';

import {Session} from "next-auth";
import {AxiosError} from "axios";
import {useSession} from "next-auth/react";
import useSWR from 'swr';
import GenericImage from "@/app/_components/GenericImage";
import BadgeWrapper from "@/components/BadgeWrapper";
import {GuildDashboardInfoProvider, useGuildDashboard} from "@/app/dashboard/[id]/dashboard-info-context";
import {
    DiscordGuild,
    DiscordGuildChannel,
    DiscordGuildMember,
    isGuildAdmin,
    RobertifyGuild
} from "@/utils/discord-types";
import React, {useEffect} from "react";
import WebClient from "@/utils/api/web-client";
import Link from "next/link";
import backIcon from "../../../../public/go-back.svg";

interface Props extends React.PropsWithChildren {
    id: string
}

async function fetcher<T>([url, session]: [url: string, session: Session | null]): Promise<T | undefined> {
    try {
        return (await WebClient.getInstance(session?.user).get(url)).data.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 404)
                return undefined;
        }
        console.error(e);
    }
}

const getDiscordGuildInfo = (id: string, session: Session | null) => {
    return useSWR([`/api/discord/guilds/${id}`, session], fetcher<DiscordGuild>);
}

const getDiscordGuildChannels = (id: string, session: Session | null) => {
    return useSWR([`/api/discord/guilds/${id}/channels`, session], fetcher<DiscordGuildChannel[]>);
}

const getBotGuildInfo = (id: string, session: Session | null) => {
    return useSWR([`/api/bot/guilds/${id}`, session], fetcher<RobertifyGuild>);
}

const getGuildMember = (server_id: string, session: Session | null) => {
    return useSWR([`/api/discord/guilds/${server_id}/member`, session], fetcher<DiscordGuildMember>);
}

export default function DashboardContextWrapper(props: Props) {
    const [, setDashboardInfo] = useGuildDashboard();
    const session = useSession();
    let {
        data: discordGuildInfo,
        error: discordGuildError,
        isLoading: discordGuildLoading,
        isValidating: discordGuildValidating
    } = getDiscordGuildInfo(props.id, session.data);
    let {
        data: discordGuildChannelInfo,
        error: discordGuildChannelError,
        isLoading: discordGuildChannelLoading,
        isValidating: discordGuildChannelValidating
    } = getDiscordGuildChannels(props.id, session.data);
    let {
        data: botGuildInfo,
        error: botGuildError,
        isLoading: botGuildLoading,
        isValidating: botGuildValidating
    } = getBotGuildInfo(props.id, session.data);
    const {
        data: guildMemberInfo,
        error: guildMemberError,
        isLoading: guildMemberLoading,
        isValidating: guildMemberValidating
    } = getGuildMember(props.id, session.data);

    // @ts-ignore
    if (discordGuildInfo?.code === 10004)
        discordGuildInfo = undefined;
    // @ts-ignore
    if (discordGuildChannelInfo?.code === 50001)
        discordGuildChannelInfo = undefined;
    // @ts-ignore
    if (botGuildInfo?.statusCode === 404)
        botGuildInfo = undefined

    const guildIcon = discordGuildInfo?.icon ? `https://cdn.discordapp.com/icons/${discordGuildInfo?.id}/${discordGuildInfo?.icon}.webp?size=512` : 'https://i.imgur.com/k14Qfh5.png';

    console.log(discordGuildLoading, botGuildLoading, discordGuildChannelLoading)

    useEffect(() => {
        setDashboardInfo({
            id: props.id,
            robertifyGuild: [botGuildInfo, botGuildLoading],
            discordGuild: [discordGuildInfo, discordGuildLoading],
            discordGuildChannels: [discordGuildChannelInfo, discordGuildChannelLoading],
            userHasPermission: guildMemberInfo ? isGuildAdmin(guildMemberInfo, discordGuildInfo!) : false
        })
    }, [botGuildInfo, discordGuildInfo, discordGuildChannelInfo, guildMemberInfo, discordGuildLoading, botGuildLoading, discordGuildChannelLoading, guildMemberLoading])

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
                <div className='flex gap-12 phone:gap-6'>
                    <GenericImage
                        className='relative w-20 h-20 phone:w-16 phone:h-16 rounded-full'
                        imageClassName='rounded-full'
                        src={guildIcon}
                        style={{
                            objectFit: 'cover'
                        }}
                    />
                    <h1 className='text-4xl phone:text-xl font-black tracking-wider text-primary self-center z-10'>{discordGuildInfo?.name}</h1>
                    <BadgeWrapper color='primary' size='sm'>BETA</BadgeWrapper>
                </div>
            </div>
            {props.children}
        </div>
    )
}