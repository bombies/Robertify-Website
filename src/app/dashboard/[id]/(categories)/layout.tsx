'use client';

import React, {useEffect, useState, useTransition} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {RobertifyGuild} from "@/utils/discord-types";
import {compare} from "@/utils/general-utils";
import DashboardUnsavedChangesPopup from "@/app/dashboard/[id]/(categories)/dashboard-unsaved-changes-popup";
import {sendToast} from "@/utils/client-utils";
import {ButtonType} from "@/components/button/ButtonType";
import {Session} from "next-auth";
import useSWRMutation from "swr/mutation";
import DashboardCategorySelector from "@/app/dashboard/[id]/dashboard-category-selector";
import WebClient from "@/utils/api/web-client";
import {Loading} from "@nextui-org/react";
import {useGuildDashboard} from "@/app/dashboard/[id]/dashboard-context-wrapper";

type Props = React.PropsWithChildren;

const POSTChanges = (session: Session | null, guildId: string, guildInfo?: Partial<RobertifyGuild>) => {
    const mutator = async (url: string) => await WebClient.getInstance(session?.user).post(url, guildInfo);
    return useSWRMutation(`/api/bot/guilds/${guildId}`, mutator)
}

const GetCurrentBotInfo = (session: Session | null, id: string) => {
    const mutator = async (url: string) => await WebClient.getInstance(session?.user).get(url);
    return useSWRMutation(`/api/bot/guilds/${id}`, mutator)
}

export default function DashboardCategoryLayout({children}: Props) {
    const [dashboardInfo, setDashboardInfo] = useGuildDashboard();
    const {value: discordGuild, loading: discordGuildLoading} = dashboardInfo.discordGuild;
    const {value: discordGuildChannels, loading: discordGuildChannelsLoading} = dashboardInfo.discordGuildChannels;
    let {value: robertifyGuild, loading: robertifyGuildLoading} = dashboardInfo.robertifyGuild;
    const session = useSession();
    const {currentData, changesMade} = dashboardInfo;
    const router = useRouter();
    const [, startTransition] = useTransition();
    // @ts-ignore
    const {
        isMutating: isSaving,
        trigger: triggerSave
    } = POSTChanges(session.data, dashboardInfo.id!, currentData);
    // @ts-ignore
    const {
        isMutating: isRefreshing,
        trigger: triggerRefresh
        // @ts-ignore
    } = GetCurrentBotInfo(session.data, robertifyGuild?.server_id);
    const canInteract = (!!dashboardInfo.userHasPermission.value) && !isSaving && !isRefreshing;

    useEffect(() => {
        setDashboardInfo(prev => ({
            ...prev,
            canInteract
        }))
    }, [canInteract]);

    const setChangesMade = (v: boolean) => {
        setDashboardInfo(prev => ({
            ...prev,
            changesMade: v
        }));
    }

    const setCurrentData = (cb: (prev?: Partial<RobertifyGuild>) => RobertifyGuild | undefined) => {
        setDashboardInfo(prev => {
            const newData = cb(prev.currentData);
            if (!newData)
                return {
                    ...prev,
                    currentData: undefined
                }
            else return {
                ...prev,
                currentData: newData
            }
        })
    }

    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=269479308656&scope=bot%20applications.commands&redirect_uri=${encodeURI(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot%20applications.commands&guild_id=${dashboardInfo.id}&disable_guild_select=true`;

    useEffect(() => {
        if (session.status === 'loading')
            return;

        if (session.status === 'unauthenticated')
            signIn('discord', {
                callbackUrl: `/dashboard/${dashboardInfo.id}/general`
            })

        else if (!robertifyGuild && !robertifyGuildLoading)
            return router.push(inviteLink);
    }, [discordGuild, robertifyGuild, discordGuildChannels, discordGuildLoading, robertifyGuildLoading, discordGuildChannelsLoading, inviteLink, router, session.data, session.status])

    useEffect(() => {
        const b = compareData(currentData, robertifyGuild);
        setChangesMade(b);
    }, [currentData, robertifyGuild]);

    if (!discordGuild || !robertifyGuild || !discordGuildChannels)
        if (discordGuildLoading || robertifyGuildLoading || discordGuildChannelsLoading)
            return (
                <div className='flex justify-center'>
                    <Loading size="xl"/>
                </div>
            )
        else
            return (<div></div>);

    const saveChanges = () => {
        if (!canInteract || !changesMade)
            return;
        startTransition(() => {
            triggerSave()
                .then(() => {
                    if (!currentData) return;

                    let currDataCopy = {...currentData};
                    currDataCopy.autoplay ??= false;
                    currDataCopy.twenty_four_seven_mode ??= false;
                    setDashboardInfo(prev => {
                        if (!prev.robertifyGuild.value)
                            return prev;

                        return ({
                            ...prev,
                            robertifyGuild: {
                                ...prev.robertifyGuild, value: {
                                    ...prev.robertifyGuild.value,
                                    ...currDataCopy
                                }
                            },
                            currentData: undefined
                        })
                    });
                    router.refresh()
                    sendToast({
                        description: 'All changes made successfully.'
                    })
                }, (e) => {
                    console.error(e);
                    setChangesMade(true)
                    sendToast({
                        description: 'Could not save your changes!',
                        type: ButtonType.DANGER
                    })
                });
        });
    }

    const discardChanges = () => {
        if (!canInteract || !changesMade)
            return;
        setCurrentData(() => robertifyGuild);
        sendToast({
            description: 'Discarded all changes!',
            type: ButtonType.WARNING
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
                    setDashboardInfo(prev => {
                        if (!prev.robertifyGuild.value)
                            return prev;

                        return ({
                            ...prev,
                            robertifyGuild: {
                                ...prev.robertifyGuild, value: {
                                    ...prev.robertifyGuild.value,
                                    ...fetchedData
                                }
                            },
                            currentData: {
                                ...fetchedData
                            }
                        })
                    });

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
        <div>
            <DashboardCategorySelector
                canInteract={canInteract}
                isRefreshing={isRefreshing}
                refresh={refresh}
            />
            <div className='relative'>
                <DashboardUnsavedChangesPopup
                    isSaving={isSaving}
                    changesMade={!!changesMade}
                    saveChanges={saveChanges}
                    discardChanges={discardChanges}
                    canInteract={canInteract}
                />
                {children}
            </div>
        </div>
    )
}

const compareData = (cur?: Partial<RobertifyGuild>, original?: RobertifyGuild) => {
    if (!cur || !original) return false;
    if (cur && "_id" in cur)
        // @ts-ignore
        delete cur._id;
    if (original && "_id" in original)
        // @ts-ignore
        delete original._id;

    const originalKeys = (Object.keys(original) as (keyof RobertifyGuild)[]);
    const keysToExtract = (Object.keys(cur) as (keyof RobertifyGuild)[]);
    let mutableOriginal = {...original};

    originalKeys.forEach(key => {
        if (!keysToExtract.includes(key))
            delete mutableOriginal[key]
    });

    return !compare(cur, mutableOriginal);
}