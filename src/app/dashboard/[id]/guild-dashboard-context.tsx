'use client';

import {DiscordGuild, DiscordGuildChannel, LocaleString, RobertifyGuild, ThemeString} from "@/utils/discord-types";
import {useRouter} from "next/navigation";
import backIcon from '/public/go-back.svg';
import Link from "next/link";
import DashboardSection from "@/app/dashboard/[id]/dashboard-section";
import DashboardSectionContent from "@/app/dashboard/[id]/dashboard-section-content";
import SelectMenu from "@/components/select-menu/SelectMenu";
import {useEffect, useState, useTransition} from "react";
import {compare} from "@/utils/general-utils";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import WebClient from "@/utils/api/web-client";
import GuildDashboardHandler from "@/app/dashboard/[id]/guild-dashboard-handler";
import saveIcon from '/public/save.svg';
import discardIcon from '/public/discard.svg';
import Toggle from "@/components/toggle";
import Card from "@/components/card";
import {signIn, useSession} from "next-auth/react";
import {Session} from "next-auth";
import useSWRMutation from 'swr/mutation';
import GenericImage from "@/app/_components/GenericImage";
import {sendToast} from "@/utils/client-utils";
import refreshIcon from '/public/refresh.svg';
import {AxiosError} from "axios";

type Props = {
    id: string,
    discordGuildInfo: DiscordGuild,
    discordGuildChannels: DiscordGuildChannel[]
    robertifyGuildInfo: RobertifyGuild,
    userHasPermission: boolean,
}

const POSTChanges = (session: Session | null, guildId: string, guildInfo: RobertifyGuild) => {
    const mutator = async (url: string) => {
        await WebClient.getInstance(session?.user).post(url, guildInfo);
    }

    return useSWRMutation(`/api/bot/guilds/${guildId}`, mutator)
}

const CreateReqChannel = (session: Session | null, id: string) => {
    const mutator = async (url: string) => {
        return await WebClient.getInstance(session?.user).post(url);
    }

    return useSWRMutation(`/api/bot/guilds/${id}/reqchannel`, mutator);
}

const GetCurrentBotInfo = (session: Session | null, id: string) => {
    const mutator = async (url: string) => {
        return await WebClient.getInstance(session?.user).get(url);
    }

    return useSWRMutation(`/api/bot/guilds/${id}`, mutator)
}

const DeleteReqChannel = (session: Session | null, id: string) => {
    const mutator = async (url: string) => {
        return await WebClient.getInstance(session?.user).delete(url);
    }

    return useSWRMutation(`/api/bot/guilds/${id}/reqchannel`, mutator);
}

const hasReqChannel = (currentData: RobertifyGuild) => {
    return currentData.dedicated_channel?.channel_id && currentData.dedicated_channel?.channel_id !== '-1';
}

export default function GuildDashboardContext(props: Props) {
    const session = useSession();
    const router = useRouter();
    const [currentData, setCurrentData] = useState(props.robertifyGuildInfo)
    const [changesMade, setChangesMade] = useState(false);
    const [, startTransition] = useTransition();

    // @ts-ignore
    const {error: saveError, isMutating: isSaving, trigger: triggerSave} = POSTChanges(session, props.id, currentData);
    const {
        error: reqChannelCreationError,
        isMutating: isCreatingReqChannel,
        trigger: triggerReqChannelCreation
        // @ts-ignore
    } = CreateReqChannel(session, props.robertifyGuildInfo?.server_id);
    const {
        error: reqChannelDeletionError,
        isMutating: isDeletingReqChannel,
        trigger: triggerReqChannelDeletion
        // @ts-ignore
    } = DeleteReqChannel(session, props.robertifyGuildInfo?.server_id);
    // @ts-ignore
    const {
        error: refreshError,
        isMutating: isRefreshing,
        trigger: triggerRefresh
        // @ts-ignore
    } = GetCurrentBotInfo(session, props.id);
    const canInteract = props.userHasPermission && !isSaving && !isRefreshing && !isCreatingReqChannel && !isDeletingReqChannel;
    const handler = new GuildDashboardHandler(
        currentData,
        props.discordGuildInfo,
        props.discordGuildChannels,
        setCurrentData,
        canInteract
    );
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=269479308656&scope=bot%20applications.commands&redirect_uri=${encodeURI(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot%20applications.commands&guild_id=${props.id}&disable_guild_select=true`;

    useEffect(() => {
        if (session.status !== 'loading' && (session.status === 'unauthenticated' || !session.data))
            signIn('discord', {
                callbackUrl: '/'
            });
    }, [session])


    useEffect(() => {
        if (!props.discordGuildInfo || !props.robertifyGuildInfo || !props.discordGuildChannels)
            return router.push(inviteLink);
    }, [props.discordGuildInfo, props.robertifyGuildInfo, props.discordGuildChannels, inviteLink, router])

    useEffect(() => {
        const b = compareData(currentData, props.robertifyGuildInfo);
        setChangesMade(b);
    }, [currentData, props.robertifyGuildInfo]);

    if (!props.discordGuildInfo || !props.robertifyGuildInfo || !props.discordGuildChannels)
        return (<div></div>);

    const createReqChannel = () => {
        if (!canInteract)
            return;
        startTransition(() => {
            triggerReqChannelCreation()
                .then((data) => {
                    if (data) {
                        const dataParsed = data.data.data;
                        const configParsed = JSON.parse(dataParsed.config);

                        setCurrentData(prevState => {
                            const ret = ({
                                ...prevState,
                                dedicated_channel: {
                                    ...prevState.dedicated_channel,
                                    ...dataParsed,
                                    config: configParsed
                                },
                            });

                            props.robertifyGuildInfo = ret;
                            return ret;
                        });
                        router.refresh();
                        sendToast({
                            description: 'Request channel has been created!'
                        })
                    }
                }, e => {
                    if (e instanceof AxiosError) {
                        const errMsg: string = e.response?.data.data.message;
                        if (errMsg) {
                            if (errMsg.toLowerCase().includes("already has a request channel")) {
                                sendToast({
                                    description: 'This server already has a request channel setup!',
                                    type: ButtonType.DANGER
                                })
                                refresh();
                                return;
                            } else if (errMsg.includes("don't have the required permissions")) {
                                sendToast({
                                    description: "The bot doesn't have enough permission in this server to create the request channel! Make sure the bot has the Manage Channels permission before attempting to delete the channel again!",
                                    type: ButtonType.DANGER
                                }, {
                                    duration: 10000,
                                })
                                return;
                            }
                        }
                    }

                    console.error(e);
                    sendToast({
                        description: 'Could not create your request channel.',
                        type: ButtonType.DANGER
                    })
                });
        })
    }

    const deleteReqChannel = () => {
        if (!canInteract)
            return;
        startTransition(() => {
            triggerReqChannelDeletion()
                .then(() => {
                    setCurrentData(prevState => {
                        const ret: RobertifyGuild = ({
                            ...prevState,
                            dedicated_channel: {
                                ...prevState.dedicated_channel,
                                channel_id: '-1',
                                message_id: '-1',
                            },
                        });

                        props.robertifyGuildInfo = ret;
                        return ret;
                    });
                    router.refresh();
                    sendToast({
                        description: 'Request channel has been deleted!'
                    });
                }, (e: any) => {
                    if (e instanceof AxiosError) {
                        const errMsg: string = e.response?.data.data.message.toLowerCase();
                        if (errMsg) {
                            if (errMsg.includes("doesn't have a channel set")) {
                                sendToast({
                                    description: 'This server does not have a request channel!',
                                    type: ButtonType.DANGER
                                })
                                refresh();
                                return;
                            } else if (errMsg.includes("don't have the required permissions")) {
                                sendToast({
                                    description: "The bot doesn't have enough permission in this server to delete the request channel! Make sure the bot has the Manage Channels permission before attempting to delete the channel again!",
                                    type: ButtonType.DANGER
                                }, {
                                    duration: 10000
                                })
                                return;
                            }
                        }
                    }

                    console.error(e);
                    sendToast({
                        description: 'Could not delete your request channel.',
                        type: ButtonType.DANGER
                    })
                });
        })
    }

    const saveChanges = () => {
        if (!canInteract || !changesMade)
            return;
        startTransition(() => {
            triggerSave()
                .then(() => {
                    currentData.autoplay ??= false;
                    currentData.twenty_four_seven_mode ??= false;
                    props.robertifyGuildInfo = currentData;
                    setChangesMade(false);
                    router.refresh()
                    sendToast({
                        description: 'All changes made successfully.'
                    })
                }, (e) => {
                    console.error(e);
                    setChangesMade(true);
                    sendToast({
                        description: 'Could not save your changes!',
                        type: ButtonType.DANGER
                    })
                });
        });
    }

    const refresh = () => {
        if (!canInteract)
            return;
        startTransition(() => {
            triggerRefresh()
                .then(data => {
                    if (!data) {
                        sendToast({
                            description: 'There was no data fetched on refresh!',
                            type: ButtonType.DANGER
                        })
                        return;
                    }
                    const fetchedData = data.data.data;
                    fetchedData.autoplay ??= false;
                    fetchedData.twenty_four_seven_mode ??= false;
                    props.robertifyGuildInfo = fetchedData;
                    setCurrentData(props.robertifyGuildInfo);
                    setChangesMade(false);
                    router.refresh()
                    sendToast({
                        description: "Successfully refreshed this server's data!"
                    })
                })
                .catch(e => {
                    sendToast({
                        description: "There was an error trying to refresh this server's data!",
                        type: ButtonType.DANGER
                    });
                    console.error(e);
                })
        })
    }

    const discardChanges = () => {
        if (!canInteract || !changesMade)
            return;
        setCurrentData(props.robertifyGuildInfo);
        sendToast({
            description: 'Discarded all changes!',
            type: ButtonType.WARNING
        })
    }

    const guildIcon = props.discordGuildInfo.icon ? `https://cdn.discordapp.com/icons/${props.discordGuildInfo.id}/${props.discordGuildInfo.icon}.webp?size=512` : 'https://i.imgur.com/k14Qfh5.png';

    return (
        <div className='relative'>
            <div
                className={'fixed rounded-xl w-full bottom-0 right-0 mx-auto bg-primary/90 dark:bg-neutral-900/80 backdrop-blur-sm h-20 z-[51] p-6 flex phone:gap-2 justify-between transition-fast' + (!changesMade ? ' bottom-[-200px]' : '')}>
                <p className='text-white dark:text-primary dark:drop-shadow-glow-primary-lg font-semibold text-2xl phone:text-sm self-center'>You
                    have unsaved changes!
                </p>
                <div className='flex gap-4'>
                    <Button
                        isWorking={isSaving}
                        label='Save'
                        icon={saveIcon}
                        className='self-center w-[8rem] h-[3rem] phone:w-[6rem]'
                        onClick={saveChanges}
                        disabled={!canInteract}
                    />
                    <Button
                        label='Discard'
                        type={ButtonType.WARNING}
                        icon={discardIcon}
                        className='self-center w-[8rem] h-[3rem] phone:w-[6rem]'
                        onClick={discardChanges}
                        disabled={!canInteract}
                    />
                </div>
            </div>
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
                    <h1 className='text-4xl phone:text-xl font-black tracking-wider text-primary self-center z-10'>{props.discordGuildInfo.name}</h1>
                </div>
            </div>
            <div
                className='relative mx-auto space-y-6 mb-12 p-12 tablet:p-6 bg-primary/10 shadow-md dark:bg-neutral-900 w-full min-h-42 rounded-2xl border-2 border-primary/90'>
                {!props.userHasPermission && <div
                    className='absolute w-full h-full bg-dark/80 z-10 top-0 left-0 rounded-2xl p-12 tablet:p-6 phone:p-3'>
                    <Card
                        centered
                        hoverable
                        size='lg'
                        title="No Permission"
                        description="It looks like you don't have enough permission to interact with the dashboard. You need to have administrative permissions in this server to edit bot settings here."
                    />
                </div>}
                <DashboardSection title='Request Channel'>
                    {
                        !hasReqChannel(currentData) ?
                            <Card
                                title='No Request Channel'
                                description="You currently don't have a request channel setup.\nClick the button below to experience the best Robertify has to offer."
                                size='md'
                            >
                                <Button
                                    isWorking={isCreatingReqChannel}
                                    disabled={!canInteract}
                                    label='Create Request Channel'
                                    type={ButtonType.CTA}
                                    height={3}
                                    width={12}
                                    onClick={createReqChannel}
                                />
                            </Card> :
                            <Card
                                className='relative !w-5/6 laptop:!w-full'
                            >
                                <p className='text-xl phone:text-sm tablet:text-center tracking-widest font-semibold mb-6 text-secondary dark:text-white'>Select
                                    which buttons you want to be displayed in your request channel</p>
                                <div
                                    className='grid grid-cols-5 laptop:grid-cols-3 tablet:grid-cols-2 tablet:place-items-center phone:grid-cols-1 gap-4'>
                                    {handler.generateReqChannelButtons()}
                                </div>
                                <Button
                                    className='mt-12'
                                    label='Delete Request Channel'
                                    isWorking={isDeletingReqChannel}
                                    disabled={!canInteract}
                                    icon={discardIcon}
                                    width={14}
                                    height={3}
                                    onClick={deleteReqChannel}
                                    type={ButtonType.DANGER}
                                />
                            </Card>
                    }
                </DashboardSection>
                <DashboardSection
                    title='Management'
                    className='grid grid-cols-3 laptop:grid-cols-2 phone:grid-cols-1 gap-6'
                >
                    <DashboardSectionContent
                        title='Theme'
                        description="Set the bot's theme"
                        contentAlign='below'
                    >
                        <SelectMenu
                            noDeselect
                            placeholder='Select a theme'
                            size='sm'
                            content={handler.generateThemesContent()}
                            displayCategories={false}
                            handleItemSelect={(item) => {
                                handler.setTheme(item.value as ThemeString)
                            }}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Language'
                        description="Set the bot's language"
                        contentAlign='below'
                    >
                        <SelectMenu
                            noDeselect
                            placeholder='Select a language'
                            size='sm'
                            content={handler.generateLocaleContent()}
                            displayCategories={false}
                            handleItemSelect={(item) => {
                                handler.setLocale(item.value as LocaleString)
                            }}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
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
                            handleItemSelect={(item) => handler.addDJRole(item.value)}
                            handleItemDeselect={(item) => handler.removeDJRole(item.value)}
                            disabled={!canInteract}
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
                            disabled={!canInteract}
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
                            disabled={!canInteract}
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
                            disabled={!canInteract}
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
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Restricted Voice Channels'
                        description='Toggle whether you want Robertify to join specific voice channels or not.'
                    >
                        <Toggle
                            status={handler.getToggle('restricted_voice_channels')}
                            onClick={() => handler.switchToggle('restricted_voice_channels')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Announcements'
                        description='Toggle whether you want song announcements to be made when they have begun playing.'
                    >
                        <Toggle
                            status={handler.getToggle('announce_messages')}
                            onClick={() => handler.switchToggle('announce_messages')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Requester'
                        description='Toggle if you want the requester for songs to be displayed in songs announcements and your request channel.'
                    >
                        <Toggle
                            status={handler.getToggle('show_requester')}
                            onClick={() => handler.switchToggle('show_requester')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='8 Ball'
                        description='Toggle whether the 8 ball feature should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('8ball')}
                            onClick={() => handler.switchToggle('8ball')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Polls'
                        description='Toggle whether the polls feature should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('polls')}
                            onClick={() => handler.switchToggle('polls')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Reminders'
                        description='Toggle whether the reminders feature should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('reminders')}
                            onClick={() => handler.switchToggle('reminders')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Tips'
                        description='Toggle whether you want tips to be sent in your channels or not.'
                    >
                        <Toggle
                            status={handler.getToggle('tips')}
                            onClick={() => handler.switchToggle('tips')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Vote Skips'
                        description='Toggle whether you want the vote skip feature to be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('vote_skips')}
                            onClick={() => handler.switchToggle('vote_skips')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='Auto Play'
                        description='Toggle whether you auto play should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('autoplay')}
                            onClick={() => handler.switchToggle('autoplay')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                    <DashboardSectionContent
                        title='24/7 Mode'
                        description='Toggle whether 24/7 mode should be enabled or not.'
                    >
                        <Toggle
                            status={handler.getToggle('twenty_four_seven_mode')}
                            onClick={() => handler.switchToggle('twenty_four_seven_mode')}
                            disabled={!canInteract}
                        />
                    </DashboardSectionContent>
                </DashboardSection>
                <DashboardSection
                    title='DJ Toggles'
                    description='Customize which audio commands you want to be accessible to your DJs only.'
                    className='grid grid-cols-3 tablet:grid-cols-2 phone:grid-cols-1 gap-6'
                >
                    {handler.generateDJToggleElements()}
                </DashboardSection>
                <DashboardSection
                    title='Log Channel Toggles'
                    description='Customize which logs should be sent to your log channel.'
                    className='grid grid-cols-3 tablet:grid-cols-2 phone:grid-cols-1 gap-6'
                >
                    {handler.generateLogToggleElements()}
                </DashboardSection>
                <Button
                    label='Refresh'
                    disabled={!canInteract}
                    isWorking={isRefreshing}
                    icon={refreshIcon}
                    height={3}
                    width={8}
                    onClick={refresh}
                />
            </div>
        </div>
    )
}

const compareData = (cur: RobertifyGuild, original: RobertifyGuild) => {
    if (!cur && !original) return false;
    if ("_id" in cur)
        // @ts-ignore
        delete cur._id;
    if ("_id" in original)
        // @ts-ignore
        delete original._id;
    return !compare(cur, original);
}
