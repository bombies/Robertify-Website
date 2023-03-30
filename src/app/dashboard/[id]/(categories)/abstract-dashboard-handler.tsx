import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/utils/discord-types";
import {Dispatch, SetStateAction} from "react";
import {DashboardState} from "@/utils/redux/slices/dashboard-slice";

export type AbstractDashboardFields = {
    robertifyGuild?: RobertifyGuild,
    discordGuild?: DiscordGuild,
    guildChannels?: DiscordGuildChannel[],
    setDashboardState?: Dispatch<SetStateAction<DashboardState>>,
    canInteract: boolean,
}

export default abstract class AbstractDashboardHandler {
    protected constructor(protected readonly opts: AbstractDashboardFields) {
    }

    protected isUsable(): boolean {
        return (!!this.opts.setDashboardState) && this.opts.canInteract;
    }

    setCurrentData(cb: (prev?: RobertifyGuild) => RobertifyGuild | undefined) {
        if (!this.opts.setDashboardState) return;

        this.opts.setDashboardState(prev => {
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

}