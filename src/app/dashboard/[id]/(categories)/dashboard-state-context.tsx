import React, {Dispatch, SetStateAction, useState} from "react";
import {GuildDashboardInfo} from "@/app/dashboard/[id]/dashboard-info-context";
import {SessionContextValue} from "next-auth/react";
import {RobertifyGuild} from "@/utils/discord-types";

export type DashboardState = {
    dashboardInfo: GuildDashboardInfo,
    session: SessionContextValue<boolean> | {readonly data: null, readonly status: "loading"},
    useCurrentData: [RobertifyGuild | undefined, Dispatch<SetStateAction<RobertifyGuild | undefined>>],
    useChangesMade: [boolean, Dispatch<SetStateAction<boolean>>],
    canInteract: boolean,
}

const DashboardStateContext = React.createContext<DashboardState | undefined>(undefined);

interface Props extends React.PropsWithChildren {
    initialData: DashboardState
}

export default function DashboardStateProvider(props: Props) {
    return (
        <DashboardStateContext.Provider value={props.initialData}>
            {props.children}
        </DashboardStateContext.Provider>
    )
}

export function useDashboardState() {
    const context = React.useContext(DashboardStateContext);
    if (!context)
        throw new Error('useDashboardState must be used within a DashboardStateProvider');
    return context;
}