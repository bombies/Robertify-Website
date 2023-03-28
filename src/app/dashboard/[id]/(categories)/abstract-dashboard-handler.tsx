import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/utils/discord-types";
import {Dispatch, SetStateAction} from "react";

export type AbstractDashboardFields = {
    robertifyGuild?: RobertifyGuild,
    discordGuild?: DiscordGuild,
    guildChannels?: DiscordGuildChannel[],
    setCurrentData?: Dispatch<SetStateAction<RobertifyGuild | undefined>>,
    canInteract: boolean,
}

export default abstract class AbstractDashboardHandler {
    protected constructor(protected readonly opts: AbstractDashboardFields) {
    }

    protected isUsable(): boolean {
        return (!!this.opts.setCurrentData) && this.opts.canInteract;
    }

    protected setData(data: Partial<RobertifyGuild>) {
        if (!this.isUsable()) return;
        this.opts.setCurrentData!(prev => {
            if (!prev) return;
            return ({
                ...prev,
                ...data
            })
        })
    }

}