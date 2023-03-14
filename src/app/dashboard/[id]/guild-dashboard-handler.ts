import {DiscordGuild, DiscordGuildChannel, DiscordRole, GuildPermissions, RobertifyGuild} from "@/utils/discord-types";
import {Dispatch, SetStateAction} from "react";
import {SelectMenuContent} from "@/components/select-menu/SelectMenu";
import discordVoiceChannelIcon from "../../../../public/discord-voice-channel.svg";
import discordTextChannelIcon from "../../../../public/discord-text-channel.svg";

export default class GuildDashboardHandler {
    constructor(
        private readonly robertifyGuild: RobertifyGuild,
        private readonly discordGuild: DiscordGuild,
        private readonly guildChannels: DiscordGuildChannel[],
        private readonly setCurrentData: Dispatch<SetStateAction<RobertifyGuild>>
    ) {
    }

    public addDJRole(id: string) {
        this.setCurrentData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                "1": prev.permissions["1"] ? [...prev.permissions["1"], id] : [id]
            }
        }))
    }

    public removeDJRole(id: string) {
        this.setCurrentData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                "1": prev.permissions["1"] ? prev.permissions["1"]?.filter(permission => permission !== id) : []
            }
        }))
    }

    public addRestrictedVoiceChannel(id: string) {
        return this.addRestrictedChannel(id, 'voice');
    }

    public addRestrictedTextChannel(id: string) {
        return this.addRestrictedChannel(id, 'text');
    }

    public removeRestrictedVoiceChannel(id: string) {
        return this.removeRestrictedChannel(id, 'voice');
    }

    public removeRestrictedTextChannel(id: string) {
        return this.removeRestrictedChannel(id, 'text');
    }

    private addRestrictedChannel(id: string, channelType: 'text' | 'voice') {
        switch (channelType) {
            case "text": {
                this.setCurrentData(prev => ({
                    ...prev,
                    restricted_channels: {
                        ...prev.restricted_channels,
                        text_channels: prev.restricted_channels.text_channels ? [...prev.restricted_channels.text_channels, id] : [id]
                    }
                }));
                break;
            }
            case "voice": {
                this.setCurrentData(prev => ({
                    ...prev,
                    restricted_channels: {
                        ...prev.restricted_channels,
                        voice_channels: prev.restricted_channels.voice_channels ? [...prev.restricted_channels.voice_channels, id] : [id]
                    }
                }));
                break;
            }
        }
    }

    private removeRestrictedChannel(id: string, channelType: 'text' | 'voice') {
        switch (channelType) {
            case "text": {
                this.setCurrentData(prev => ({
                    ...prev,
                    restricted_channels: {
                        ...prev.restricted_channels,
                        text_channels: prev.restricted_channels.text_channels ? prev.restricted_channels.text_channels.filter(channel => channel !== id) : []
                    }
                }));
                break;
            }
            case "voice": {
                this.setCurrentData(prev => ({
                    ...prev,
                    restricted_channels: {
                        ...prev.restricted_channels,
                        voice_channels: prev.restricted_channels.voice_channels ? prev.restricted_channels.voice_channels.filter(channel => channel !== id) : []
                    }
                }));
                break;
            }
        }
    }

    public generateTextChannelContent() {
        return this.generateChannelContent('text');
    }

    public generateVoiceChannelContent() {
        return this.generateChannelContent('voice');
    }

    public generateRolesContent(selectedKey?: keyof RobertifyGuild): SelectMenuContent[] {
        if (!this.discordGuild.roles)
            return [];
        const isRoleSelected = (role: DiscordRole): boolean => {
            if (!selectedKey) return false;
            const obj = this.robertifyGuild[selectedKey];
            if (!obj) return false;

            switch (selectedKey) {
                case "permissions": {
                    const permissions = obj as GuildPermissions;
                    return permissions["1"] ? permissions["1"].includes(role.id) : false;
                }
                default:
                    return false;
            }
        }

        return this.discordGuild.roles.map<SelectMenuContent>(role => ({
            label: role.name,
            value: role.id,
            selected: isRoleSelected(role)
        }));
    }

    private generateChannelContent(channelType: 'voice' | 'text'): SelectMenuContent[] {
        const convertToSelectMenuContent = (obj: { category: string | undefined, channels: DiscordGuildChannel[] }): SelectMenuContent[] => {
            return obj.channels.map<SelectMenuContent>(channel => {
                return {
                    category: obj.category,
                    label: channel.name || '',
                    value: channel.id,
                    icon: channelType === 'voice' ? discordVoiceChannelIcon : discordTextChannelIcon
                }
            })
        }

        const raw = this.extractChannelsWithCategories(channelType);
        const contents = raw.map(rawObj => convertToSelectMenuContent(rawObj));
        return contents.reduce((previousValue, currentValue, index) => ([
            ...previousValue, ...currentValue
        ]), [])
    }

    private extractChannelsWithCategories(channelType: 'voice' | 'text') {
        if (!this.guildChannels)
            return [];

        const noCategoryChannels = this.guildChannels.filter(channel => !channel.parent_id && (channel.type === (channelType === 'voice' ? 2 : 0)))

        return [
            ...this.guildChannels.filter(channel => channel.type === 4)
                .map(category => {
                    return {
                        name: category.name,
                        id: category.id
                    }
                })
                .map(category => {
                    return {
                        category: category.name,
                        channels: this.guildChannels.filter(channel => (channel.type === (channelType === 'voice' ? 2 : 0)) && channel.parent_id === category.id)
                    }
                })
                .filter(categoryObj => categoryObj.channels.length !== 0),
            {
                category: undefined,
                channels: [...noCategoryChannels]
            }
        ]
    }
}