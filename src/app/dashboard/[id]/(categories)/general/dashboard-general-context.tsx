'use client';

import {LocaleString, RobertifyGuild, ThemeString} from "@/utils/discord-types";
import {useRouter} from "next/navigation";
import DashboardSection from "@/app/dashboard/[id]/(categories)/dashboard-section";
import DashboardSectionContent from "@/app/dashboard/[id]/(categories)/dashboard-section-content";
import SelectMenu from "@/components/SelectMenu";
import {useTransition} from "react";
import {compare} from "@/utils/general-utils";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import WebClient from "@/utils/api/web-client";
import DashboardGeneralHandler from "@/app/dashboard/[id]/(categories)/general/dashboard-general-handler";
import discardIcon from '/public/discard.svg';
import Toggle from "@/components/toggle";
import Card from "@/components/card";
import {Session} from "next-auth";
import useSWRMutation from 'swr/mutation';
import {sendToast} from "@/utils/client-utils";
import {AxiosError} from "axios";
import DashboardContainer from "@/app/dashboard/[id]/(categories)/dashboard-container";
import DashboardRefreshButton from "@/app/dashboard/[id]/(categories)/dashboard-refresh-button";
import {useDashboardState} from "@/app/dashboard/[id]/(categories)/dashboard-state-context";

const CreateReqChannel = (session: Session | null, id: string) => {
    const mutator = async (url: string) => {
        return await WebClient.getInstance(session?.user).post(url);
    }

    return useSWRMutation(`/api/bot/guilds/${id}/reqchannel`, mutator);
}

export const GetCurrentBotInfo = (session: Session | null, id: string) => {
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

const hasReqChannel = (currentData?: RobertifyGuild): boolean => {
    if (!currentData) return false;
    return !!(currentData.dedicated_channel?.channel_id && currentData.dedicated_channel?.channel_id !== '-1');
}

export default function DashboardGeneralContext() {
    const {
        dashboardInfo,
        session,
        useCurrentData,
        useChangesMade,
        canInteract: stateCanInteract
    } = useDashboardState();
    const router = useRouter();
    const [currentData, setCurrentData] = useCurrentData
    const [, setChangesMade] = useChangesMade;
    const [, startTransition] = useTransition();

    const {
        isMutating: isCreatingReqChannel,
        trigger: triggerReqChannelCreation
        // @ts-ignore
    } = CreateReqChannel(session, dashboardInfo.robertifyGuild?.server_id);
    const {
        isMutating: isDeletingReqChannel,
        trigger: triggerReqChannelDeletion
        // @ts-ignore
    } = DeleteReqChannel(session, dashboardInfo.robertifyGuild?.server_id);
    // @ts-ignore
    const {
        isMutating: isRefreshing,
        trigger: triggerRefresh
        // @ts-ignore
    } = GetCurrentBotInfo(session, dashboardInfo.robertifyGuild?.server_id);
    const canInteract = stateCanInteract && !isRefreshing && !isCreatingReqChannel && !isDeletingReqChannel;
    const handler = new DashboardGeneralHandler({
        robertifyGuild: currentData,
        discordGuild: dashboardInfo.discordGuild,
        guildChannels: dashboardInfo.discordGuildChannels,
        setCurrentData,
        canInteract
    });

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
                            if (!prevState) return;

                            const ret = ({
                                ...prevState,
                                dedicated_channel: {
                                    ...prevState.dedicated_channel,
                                    ...dataParsed,
                                    config: configParsed
                                },
                            });

                            dashboardInfo.robertifyGuild = ret;
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
                        if (!prevState) return;

                        const ret: RobertifyGuild = ({
                            ...prevState,
                            dedicated_channel: {
                                ...prevState.dedicated_channel,
                                channel_id: '-1',
                                message_id: '-1',
                            },
                        });

                        dashboardInfo.robertifyGuild = ret;
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
                    dashboardInfo.robertifyGuild = fetchedData;
                    setCurrentData(dashboardInfo.robertifyGuild);
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
    return (
        <DashboardContainer>
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
            <DashboardRefreshButton
                refresh={refresh}
                isRefreshing={isRefreshing}
                canInteract={canInteract}
            />
        </DashboardContainer>
    )
}

const compareData = (cur?: RobertifyGuild, original?: RobertifyGuild) => {
    if (!cur && !original) return false;
    if (cur && "_id" in cur)
        // @ts-ignore
        delete cur._id;
    if (original && "_id" in original)
        // @ts-ignore
        delete original._id;
    return !compare(cur, original);
}
