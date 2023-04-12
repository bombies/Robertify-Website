import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/utils/discord-types";
import {Dispatch, SetStateAction} from "react";
import {DashboardState} from "@/utils/redux/slices/dashboard-slice";

export type AbstractDashboardFields = {
    robertifyGuild?: Partial<RobertifyGuild>,
    discordGuild?: DiscordGuild,
    guildChannels?: DiscordGuildChannel[],
    setDashboardState?: Dispatch<SetStateAction<DashboardState>>,
    canInteract: boolean,
}

export default abstract class AbstractDashboardHandler {
    protected constructor(private readonly opts: AbstractDashboardFields) {
    }

    protected isUsable(): boolean {
        return (!!this.opts.setDashboardState) && this.opts.canInteract;
    }

    protected getRobertifyGuild() {
        return this.opts.robertifyGuild;
    }

    protected getDiscordGuild() {
        return this.opts.discordGuild;
    }

    protected getGuildChannels() {
        return this.opts.guildChannels;
    }

    protected canInteract() {
        return this.opts.canInteract;
    }

    setCurrentData(cb: (prev?: Partial<RobertifyGuild>) => Partial<RobertifyGuild> | undefined) {
        if (!this.opts.setDashboardState) return;

        this.opts.setDashboardState(prev => {
            const newData = cb(prev.currentData ?? prev.robertifyGuild.value);
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