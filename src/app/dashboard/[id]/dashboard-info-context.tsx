'use client';

import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/utils/discord-types";
import React, {useEffect, useState} from "react";

export type GuildDashboardInfo = {
    id: string,
    discordGuild: [DiscordGuild | undefined, boolean],
    discordGuildChannels: [DiscordGuildChannel[] | undefined, boolean],
    robertifyGuild: [RobertifyGuild | undefined, boolean],
    userHasPermission: boolean,
}

const DashboardInfoContext = React.createContext<[GuildDashboardInfo, React.Dispatch<React.SetStateAction<GuildDashboardInfo>>] | undefined>(undefined);

interface Props extends React.PropsWithChildren {
}
export function GuildDashboardInfoProvider({ children }: Props) {
    const [ dashboardInfo, setDashboardInfo ] = useState<GuildDashboardInfo>({
        id: '',
        discordGuild: [undefined, true],
        robertifyGuild: [undefined, true],
        discordGuildChannels: [undefined, true],
        userHasPermission: false
    });

    useEffect(() => {
        console.log('info changed')
    }, [dashboardInfo])

    return (
        <DashboardInfoContext.Provider value={[dashboardInfo, setDashboardInfo]}>
            {children}
        </DashboardInfoContext.Provider>
    )
}

export function useGuildDashboard() {
    const context = React.useContext(DashboardInfoContext);
    if (!context)
        throw new Error('useGuildDashboard must be used within a GuildDashboardInfoProvider');
    return context;
}