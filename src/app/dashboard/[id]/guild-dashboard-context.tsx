'use client';

import {
    DiscordGuild,
    DiscordGuildChannel,
    RobertifyGuild
} from "@/utils/discord-types";
import {useRouter} from "next/navigation";
import Image from "next/image";
import backIcon from '/public/go-back.svg';
import Link from "next/link";
import DashboardSection from "@/app/dashboard/[id]/DashboardSection";
import DashboardSectionContent from "@/app/dashboard/[id]/DashboardSectionContent";
import SelectMenu from "@/components/select-menu/SelectMenu";
import {useDiscordDataRequired} from "@/app/_components/discord-data-context";
import {useEffect, useState, useTransition} from "react";
import {compare} from "@/utils/general-utils";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import WebClient from "@/utils/api/web-client";
import GuildDashboardHandler from "@/app/dashboard/[id]/guild-dashboard-handler";

type Props = {
    id: string,
    discordGuildInfo: DiscordGuild,
    discordGuildChannels: DiscordGuildChannel[]
    robertifyGuildInfo: RobertifyGuild
    apiMasterPassword?: string
}

const POSTChanges = async (apiMasterPassword: string | undefined, guildId: string, guildInfo: RobertifyGuild) => {
    if (!apiMasterPassword)
        throw new Error("The API master password is undefined!");
    return (await WebClient.getInstance({
        headers: {
            Accept: 'application/json',
            'Authorization': apiMasterPassword
        },
        timeout: 5 * 1000,
        baseURL: process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME,
    }).post(`/api/bot/guilds/${guildId}`, guildInfo))
        ?.data;
}

export default function GuildDashboardContext(props: Props) {
    const router = useRouter();
    const [currentData, setCurrentData] = useState(props.robertifyGuildInfo)
    const [changesMade, setChangesMade] = useState(false);
    const [isTransitioning, startTransition] = useTransition();
    const handler = new GuildDashboardHandler(
        currentData,
        props.discordGuildInfo,
        props.discordGuildChannels,
        setCurrentData
    );

    useEffect(() => {
        if (!props.discordGuildInfo || !props.robertifyGuildInfo || !props.discordGuildChannels)
            return router.push(`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=269479308656&scope=bot%20applications.commands&redirect_uri=${encodeURI(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot%20applications.commands&guild_id=${props.id}&disable_guild_select=true`);
    }, [])

    useEffect(() => {
        setChangesMade(compareData(currentData, props.robertifyGuildInfo))
    }, [currentData, props.robertifyGuildInfo]);

    if (!useDiscordDataRequired())
        return (<div></div>);

    const saveChanges = () => {
        if (!changesMade)
            return;
        startTransition(() => {
            POSTChanges(props.apiMasterPassword, props.robertifyGuildInfo.server_id, currentData)
                .then(() => {
                    props.robertifyGuildInfo = currentData;
                    setChangesMade(false);
                })
                .then(() => router.refresh());
        });
    }

    const discardChanges = () => {
        if (!changesMade)
            return;
        setCurrentData(props.robertifyGuildInfo);
    }

    return (
        <div>
            <div
                className={'fixed rounded-xl w-5/6 bottom-0 mx-auto bg-primary/50 dark:bg-neutral-900/80 backdrop-blur-sm h-20 z-[51] p-6 flex justify-between transition-fast' + (!changesMade ? ' bottom-[-200px]' : '')}>
                <p className='text-white dark:text-primary dark:drop-shadow-glow-primary-lg font-semibold text-2xl self-center'>You
                    have unsaved changes!</p>
                <div className='flex gap-4'>
                    <Button
                        isWorking={isTransitioning}
                        label='Save'
                        width={8}
                        height={3}
                        className='self-center'
                        onClick={saveChanges}
                    />
                    <Button
                        label='Discard'
                        type={ButtonType.DANGER}
                        width={8}
                        height={3}
                        className='self-center'
                        onClick={discardChanges}
                    />
                </div>
            </div>
            <div
                className='mx-auto mb-12 tablet:p-6 p-12 bg-primary/10 shadow-md dark:bg-neutral-900 w-3/4 h-42 rounded-2xl border-2 border-primary/90'>
                <Link href='/dashboard'>
                    <div className='flex gap-4 hover:scale-[100.25%] transition-fast mb-12'>
                        <div className='relative w-8 h-8'>
                            <Image
                                draggable={false}
                                src={backIcon}
                                alt=''
                                fill={true}
                                sizes='2rem'
                            />
                        </div>
                        <p className='relative self-center text-primary font-semibold text-xl phone:text-sm'>Return to
                            your servers</p>
                    </div>
                </Link>
                <div className='flex gap-12'>
                    <div className='relative w-32 h-32 phone:w-16 phone:h-16 rounded-full border-2 border-primary'>
                        <Image
                            draggable={false}
                            className='rounded-full'
                            src={props.discordGuildInfo.icon ? `https://cdn.discordapp.com/icons/${props.discordGuildInfo.id}/${props.discordGuildInfo.icon}.webp?size=512` : 'https://i.imgur.com/k14Qfh5.png'}
                            alt=''
                            fill={true}
                        />
                    </div>
                    <h1 className='text-5xl phone:text-xl font-bold text-primary self-center'>{props.discordGuildInfo.name}</h1>
                </div>
            </div>
            <div
                className='mx-auto mb-12 p-12 tablet:p-6  bg-primary/10 shadow-md dark:bg-neutral-900 w-3/4 min-h-42 rounded-2xl border-2 border-primary/90'>
                <DashboardSection title='Management'>
                    <div className='grid grid-cols-2 tablet:grid-cols-1 gap-6'>
                        <DashboardSectionContent
                            title='DJ Roles'
                            description='Set DJ roles.'
                            contentAlign='below'
                        >
                            <SelectMenu
                                multiSelect
                                placeholder='Select multiple roles'
                                size='sm'
                                content={handler.generateRolesContent('permissions')}
                                displayCategories={false}
                                handleItemSelect={(item) => {
                                    handler.addDJRole(item.value);
                                }}
                                handleItemDeselect={(item) => {
                                    handler.removeDJRole(item.value)
                                }}
                            />
                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='Restricted Voice Channels'
                            description='Set voice channels.'
                            contentAlign='below'
                        >
                            <SelectMenu
                                multiSelect
                                placeholder='Select multiple channels'
                                size='sm'
                                content={handler.generateVoiceChannelContent()}
                                handleItemSelect={item => handler.addRestrictedVoiceChannel(item.value)}
                                // handleItemDeselect={item => handler.removeRestrictedVoiceChannel(item.value)}
                            />
                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='Restricted Text Channels'
                            description='Set text channels'
                            contentAlign='below'
                        >
                            <SelectMenu
                                multiSelect
                                placeholder='Select multiple channels'
                                size='sm'
                                content={handler.generateTextChannelContent()}
                                handleItemSelect={item => handler.addRestrictedTextChannel(item.value)}
                                handleItemDeselect={item => handler.removeRestrictedTextChannel(item.value)}
                            />
                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='Log Channel'
                            description='Set the channel for Robertify logs to be sent'
                            contentAlign='below'
                        >
                            <SelectMenu
                                placeholder='Select a channel'
                                size='sm'
                                content={handler.generateTextChannelContent()}
                            />
                        </DashboardSectionContent>
                    </div>
                </DashboardSection>
            </div>
        </div>
    )
}

const compareData = (cur: RobertifyGuild, original: RobertifyGuild) => {
    return !compare(cur, original);
}
