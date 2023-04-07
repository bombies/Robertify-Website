import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/utils/discord-types";
import {SessionContextValue} from "next-auth/react";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "@/utils/redux/redux-store";
import {Session} from 'next-auth';

interface AsyncState<T> {
    loading: boolean,
    value?: T
}

export interface DashboardState {
    id?: string,
    discordGuild: AsyncState<DiscordGuild>
    robertifyGuild: AsyncState<RobertifyGuild>
    currentData?: Partial<RobertifyGuild>,
    discordGuildChannels: AsyncState<DiscordGuildChannel[]>
    changesMade?: boolean,
    canInteract?: boolean,
    userHasPermission: AsyncState<boolean>,
}

const initialState: DashboardState = {
    id: undefined,
    discordGuild: { loading: true },
    robertifyGuild: { loading: true },
    discordGuildChannels: { loading: true },
    userHasPermission: { loading: true },
    currentData: undefined,
    changesMade: undefined,
    canInteract: undefined
}

export const dashboardSlice = createSlice({
    name: 'guildDashboard',
    initialState,
    reducers: {
        setId(state, action: PayloadAction<string>) {
            state.id = action.payload;
        },
        setDiscordGuild(state, action: PayloadAction<AsyncState<DiscordGuild>>) {
            state.discordGuild = action.payload;
        },
        setRobertifyGuild(state, action: PayloadAction<AsyncState<RobertifyGuild>>) {
            state.robertifyGuild = action.payload;
        },
        setDiscordGuildChannels(state, action: PayloadAction<AsyncState<DiscordGuildChannel[]>>) {
            state.discordGuildChannels = action.payload
        },
        setUserHasPermission(state, action: PayloadAction<AsyncState<boolean>>) {
            state.userHasPermission = action.payload
        },
        setCanInteract(state, action: PayloadAction<boolean>) {
            state.canInteract = action.payload
        },
        setCurrentData(state, action: PayloadAction<RobertifyGuild>) {
            state.currentData = action.payload
        },
        setChangesMade(state, action: PayloadAction<boolean>) {
            state.changesMade = action.payload;
        },
        setDashboardState(state, action: PayloadAction<DashboardState>) {
            state = action.payload;
        }
    }
});

export const {
    setId,
    setChangesMade,
    setCurrentData,
    setDiscordGuildChannels,
    setDiscordGuild,
    setRobertifyGuild,
    setCanInteract,
    setUserHasPermission,
    setDashboardState
} = dashboardSlice.actions;

export const selectId = (state: AppState) => state.guildDashboard.id;
export const selectChangesMade = (state: AppState) => state.guildDashboard.changesMade;
export const selectCurrentData = (state: AppState) => state.guildDashboard.currentData;
export const selectDiscordGuildChannels = (state: AppState) => state.guildDashboard.discordGuildChannels;
export const selectDiscordGuild = (state: AppState) => state.guildDashboard.discordGuild;
export const selectRobertifyGuild = (state: AppState) => state.guildDashboard.robertifyGuild;
export const selectCanInteract = (state: AppState) => state.guildDashboard.canInteract;
export const selectUserHasPermission = (state: AppState) => state.guildDashboard.userHasPermission;
export const selectDashboardState = (state: AppState) => state.guildDashboard;

const dashboardReducer = dashboardSlice.reducer;
export default dashboardReducer;