'use client';

import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/utils/discord-types";
import React, {useState} from "react";

export type GuildDashboardInfo = {
    discordGuild?: DiscordGuild,
    discordGuildChannels?: DiscordGuildChannel[],
    robertifyGuild?: RobertifyGuild,
    userHasPermission: boolean,
}

const GuildInfoContext = React.createContext<[GuildDashboardInfo, React.Dispatch<React.SetStateAction<GuildDashboardInfo>>] | undefined>(undefined);

interface Props extends React.PropsWithChildren {
    initialDashboardInfo: GuildDashboardInfo
}
export function GuildDashboardInfoProvider({ children, initialDashboardInfo }: Props) {
    const [ dashboardInfo, setDashboardInfo ] = useState(initialDashboardInfo);

    return (
        <GuildInfoContext.Provider value={[dashboardInfo, setDashboardInfo]}>
            {children}
        </GuildInfoContext.Provider>
    )
}

export function useGuildDashboard() {
    const context = React.useContext(GuildInfoContext);
    if (!context)
        throw new Error('useDarkMode must be used within a GuildDashboardInfoProvider');
    return context;
}