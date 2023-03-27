'use client';

import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/utils/discord-types";
import React, {useState} from "react";

export type GuildDashboardInfo = {
    id: string,
    discordGuild?: DiscordGuild,
    discordGuildChannels?: DiscordGuildChannel[],
    robertifyGuild?: RobertifyGuild,
    userHasPermission: boolean,
}

const DashboardInfoContext = React.createContext<[GuildDashboardInfo, React.Dispatch<React.SetStateAction<GuildDashboardInfo>>] | undefined>(undefined);

interface Props extends React.PropsWithChildren {
    initialDashboardInfo: GuildDashboardInfo
}
export function GuildDashboardInfoProvider({ children, initialDashboardInfo }: Props) {
    const [ dashboardInfo, setDashboardInfo ] = useState(initialDashboardInfo);

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