'use client';

import React, {useEffect, useState, useTransition} from "react";
import DashboardStateProvider, {DashboardState} from "@/app/dashboard/[id]/(categories)/dashboard-state-context";
import {useGuildDashboard} from "@/app/dashboard/[id]/dashboard-info-context";
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

type Props = React.PropsWithChildren;

const POSTChanges = (session: Session | null, guildId: string, guildInfo?: RobertifyGuild) => {
    const mutator = async (url: string) => await WebClient.getInstance(session?.user).post(url, guildInfo);
    return useSWRMutation(`/api/bot/guilds/${guildId}`, mutator)
}

const GetCurrentBotInfo = (session: Session | null, id: string) => {
    const mutator = async (url: string) => await WebClient.getInstance(session?.user).get(url);
    return useSWRMutation(`/api/bot/guilds/${id}`, mutator)
}

export default function DashboardCategoryLayout({children}: Props) {
    const [dashboardInfo,] = useGuildDashboard();
    const [discordGuild, discordGuildLoading] = dashboardInfo.discordGuild;
    const [discordGuildChannels, discordGuildChannelsLoading] = dashboardInfo.discordGuildChannels;
    let [robertifyGuild, robertifyGuildLoading] = dashboardInfo.robertifyGuild;
    const session = useSession();
    const useCurrentData = useState(robertifyGuild)
    const useChangesMade = useState(false);
    const router = useRouter();
    const [, startTransition] = useTransition();
    // @ts-ignore
    const {
        isMutating: isSaving,
        trigger: triggerSave
    } = POSTChanges(session.data, dashboardInfo.id, useCurrentData[0]);
    // @ts-ignore
    const {
        isMutating: isRefreshing,
        trigger: triggerRefresh
        // @ts-ignore
    } = GetCurrentBotInfo(session.data, robertifyGuild?.server_id);
    const canInteract = dashboardInfo.userHasPermission && !isSaving && !isRefreshing;
    const dashboardState: DashboardState = {dashboardInfo, session, useCurrentData, useChangesMade, canInteract}
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=269479308656&scope=bot%20applications.commands&redirect_uri=${encodeURI(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot%20applications.commands&guild_id=${dashboardInfo.id}&disable_guild_select=true`;

    useEffect(() => {
        if (session.status === 'loading')
            return;

        if (session.status === 'unauthenticated' || !session.data)
            signIn('discord', {
                callbackUrl: `/dashboard/${dashboardInfo.id}/general`
            })
        else if ((!discordGuild && !discordGuildLoading)
            || (!robertifyGuild && !robertifyGuildLoading)
            || (!discordGuildChannels && !discordGuildChannelsLoading)
        ) {
            // return router.push(inviteLink);
        }
    }, [discordGuild, robertifyGuild, discordGuildChannels, inviteLink, router, session.data, session.status])

    useEffect(() => {
        const b = compareData(useCurrentData[0], robertifyGuild);
        console.log(b, useCurrentData[0], robertifyGuild);
        useChangesMade[1](b);
    }, [useCurrentData[0], robertifyGuild, useChangesMade[1]]);

    console.log("cat layout", discordGuildLoading, robertifyGuildLoading, discordGuildChannelsLoading)
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
        if (!canInteract || !useChangesMade[0])
            return;
        startTransition(() => {
            triggerSave()
                .then(() => {
                    if (!useCurrentData[0]) return;

                    useCurrentData[0].autoplay ??= false;
                    useCurrentData[0].twenty_four_seven_mode ??= false;
                    robertifyGuild = useCurrentData[0];
                    useChangesMade[1](false);
                    router.refresh()
                    sendToast({
                        description: 'All changes made successfully.'
                    })
                }, (e) => {
                    console.error(e);
                    useChangesMade[1](true);
                    sendToast({
                        description: 'Could not save your changes!',
                        type: ButtonType.DANGER
                    })
                });
        });
    }

    const discardChanges = () => {
        if (!canInteract || !useChangesMade[0])
            return;
        useCurrentData[1](robertifyGuild);
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
                    dashboardInfo.robertifyGuild = fetchedData;
                    useCurrentData[1](robertifyGuild);
                    useChangesMade[1](false);
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
        <DashboardStateProvider initialData={dashboardState}>
            <DashboardCategorySelector canInteract={canInteract} isRefreshing={isRefreshing} refresh={refresh}/>
            <div className='relative'>
                <DashboardUnsavedChangesPopup
                    isSaving={isSaving}
                    changesMade={useChangesMade[0]}
                    saveChanges={saveChanges}
                    discardChanges={discardChanges}
                    canInteract={canInteract}
                />
                {children}
            </div>
        </DashboardStateProvider>
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