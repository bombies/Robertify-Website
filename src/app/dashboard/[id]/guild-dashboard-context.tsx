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
import DashboardSection from "@/app/dashboard/[id]/dashboard-section";
import DashboardSectionContent from "@/app/dashboard/[id]/dashboard-section-content";
import SelectMenu from "@/components/select-menu/SelectMenu";
import {useDiscordDataRequired} from "@/app/_components/discord-data-context";
import {useEffect, useState, useTransition} from "react";
import {compare} from "@/utils/general-utils";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import WebClient from "@/utils/api/web-client";
import GuildDashboardHandler from "@/app/dashboard/[id]/guild-dashboard-handler";
import saveIcon from '/public/save.svg';
import discardIcon from '/public/discard.svg';
import Toggle from "@/components/toggle";

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
                        icon={saveIcon}
                        width={8}
                        height={3}
                        className='self-center'
                        onClick={saveChanges}
                    />
                    <Button
                        label='Discard'
                        type={ButtonType.DANGER}
                        icon={discardIcon}
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
                className='mx-auto space-y-6 mb-12 p-12 tablet:p-6  bg-primary/10 shadow-md dark:bg-neutral-900 w-3/4 min-h-42 rounded-2xl border-2 border-primary/90'>
                <DashboardSection
                    title='Management'
                    className='grid grid-cols-2 tablet:grid-cols-1 gap-6'
                >
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
                            content={handler.generateVoiceChannelContent('restricted_channels')}
                            handleItemSelect={item => handler.addRestrictedVoiceChannel(item.value)}
                            handleItemDeselect={item => handler.removeRestrictedVoiceChannel(item.value)}
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
                            content={handler.generateTextChannelContent('restricted_channels')}
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
                            content={handler.generateTextChannelContent('log_channel')}
                            handleItemSelect={item => handler.addLogChannel(item.value)}
                            handleItemDeselect={() => handler.removeLogChannel()}
                        />
                    </DashboardSectionContent>
                </DashboardSection>
                <DashboardSection
                    title='Toggles'
                    className='grid grid-cols-2 tablet:grid-cols-1 gap-6'
                >
                    <DashboardSectionContent
                        title='Restricted Text Channels'
                        description='Toggle whether you want commands to be restricted to certain channels or not.'
                    >
                        <Toggle
                            status={handler.getToggle('restricted_text_channels')}
                            onClick={() => handler.switchToggle('restricted_text_channels')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Restricted Voice Channels'
                        description='Toggle whether you want Robertify to join specific voice channels or not.'
                    >
                        <Toggle
                            status={handler.getToggle('restricted_voice_channels')}
                            onClick={() => handler.switchToggle('restricted_voice_channels')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Announcements'
                        description='Toggle whether you want song announcements to be made when they have begun playing.'
                    >
                        <Toggle
                            status={handler.getToggle('announce_messages')}
                            onClick={() => handler.switchToggle('announce_messages')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Requester'
                        description='Toggle if you want the requester for songs to be displayed in songs announcements and your request channel.'
                    >
                        <Toggle
                            status={handler.getToggle('show_requester')}
                            onClick={() => handler.switchToggle('show_requester')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='8 Ball'
                        description='Toggle whether the 8 ball feature should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('8ball')}
                            onClick={() => handler.switchToggle('8ball')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Polls'
                        description='Toggle whether the polls feature should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('polls')}
                            onClick={() => handler.switchToggle('polls')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Reminders'
                        description='Toggle whether the reminders feature should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('reminders')}
                            onClick={() => handler.switchToggle('reminders')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Tips'
                        description='Toggle whether you want tips to be sent in your channels or not.'
                    >
                        <Toggle
                            status={handler.getToggle('tips')}
                            onClick={() => handler.switchToggle('tips')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Vote Skips'
                        description='Toggle whether you want the vote skip feature to be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('vote_skips')}
                            onClick={() => handler.switchToggle('vote_skips')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Auto Play'
                        description='Toggle whether you auto play should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('autoplay')}
                            onClick={() => handler.switchToggle('autoplay')}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='24/7 Mode'
                        description='Toggle whether 24/7 mode should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('twenty_four_seven_mode')}
                            onClick={() => handler.switchToggle('twenty_four_seven_mode')}
                        />
                    </DashboardSectionContent>
                </DashboardSection>
                <DashboardSection title='DJ Toggles' className='grid grid-cols-2 tablet:grid-cols-1 gap-6'>
                    {handler.generateDJToggleElements()}
                </DashboardSection>
                <DashboardSection title='Log Channel Toggles' className='grid grid-cols-2 tablet:grid-cols-1 gap-6'>
                    {handler.generateLogToggleElements()}
                </DashboardSection>
            </div>
        </div>
    )
}

const compareData = (cur: RobertifyGuild, original: RobertifyGuild) => {
    return !compare(cur, original);
}
