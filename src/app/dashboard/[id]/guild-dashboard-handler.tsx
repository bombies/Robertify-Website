import {
    DiscordGuild,
    DiscordGuildChannel,
    DiscordRole,
    GuildDJToggles,
    GuildLogToggles,
    GuildPermissions,
    GuildToggles, LocaleString,
    RobertifyGuild, ThemeString
} from "@/utils/discord-types";
import {Dispatch, SetStateAction} from "react";
import {SelectMenuContent} from "@/components/select-menu/SelectMenu";
import discordVoiceChannelIcon from "../../../../public/discord-voice-channel.svg";
import discordTextChannelIcon from "../../../../public/discord-text-channel.svg";
import Toggle from "@/components/toggle";
import DashboardSectionContent from "@/app/dashboard/[id]/dashboard-section-content";
import {StaticImageData} from "next/image";

export default class GuildDashboardHandler {
    constructor(
        private readonly robertifyGuild: RobertifyGuild,
        private readonly discordGuild: DiscordGuild,
        private readonly guildChannels: DiscordGuildChannel[],
        private readonly setCurrentData: Dispatch<SetStateAction<RobertifyGuild>>
    ) {
    }

    public generateDJToggleElements() {
        const obj = this.robertifyGuild.toggles.dj_toggles;
        return (Object.keys(obj) as (keyof GuildDJToggles)[])
            .sort((a, b) => a.localeCompare(b))
            .map(key => (
                <DashboardSectionContent
                    key={key}
                    title={key}
                >
                    <Toggle
                        status={this.getToggle('dj_toggles', key)}
                        onClick={() => this.switchToggle('dj_toggles', key)}
                    />
                </DashboardSectionContent>
            ));
    }

    private genDefaultLogTogglesObject(): GuildLogToggles {
        return {
            queue_add: true,
            track_move: true,
            track_loop: true,
            player_pause: true,
            track_vote_skip: true,
            queue_shuffle: true,
            player_resume: true,
            volume_change: true,
            track_seek: true,
            track_previous: true,
            track_skip: true,
            track_rewind: true,
            bot_disconnected: true,
            queue_remove: true,
            filter_toggle: true,
            player_stop: true,
            queue_loop: true,
            queue_clear: true,
            track_jump: true
        }
    }

    public generateLogToggleElements() {
        let obj = this.robertifyGuild.toggles.log_toggles ?? this.genDefaultLogTogglesObject();
        return (Object.keys(obj) as (keyof GuildLogToggles)[])
            .sort((a, b) => a.localeCompare(b))
            .map(key => (
                <DashboardSectionContent
                    key={key}
                    title={key.replaceAll('_', ' ')}
                >
                    <Toggle
                        status={this.getToggle('log_toggles', key)}
                        onClick={() => this.switchToggle('log_toggles', key)}
                    />
                </DashboardSectionContent>
            ));
    }

    public getToggle(toggle: keyof GuildToggles | 'autoplay' | 'twenty_four_seven_mode', innerToggle?: keyof GuildDJToggles | keyof GuildLogToggles) {
        const obj = this.robertifyGuild.toggles;
        switch (toggle) {
            case "dj_toggles": {
                if (!innerToggle)
                    return false;
                const djToggles = obj.dj_toggles;
                if (!(innerToggle in djToggles))
                    return false;
                return djToggles[innerToggle as keyof GuildDJToggles] || false;
            }
            case "log_toggles": {
                if (!innerToggle)
                    return false;
                const logToggles = obj.log_toggles ?? this.genDefaultLogTogglesObject();
                if (!(innerToggle in logToggles))
                    return false;
                return logToggles[innerToggle as keyof GuildLogToggles] || false;
            }
            case "autoplay":
                return this.robertifyGuild.autoplay || false;
            case "twenty_four_seven_mode":
                return this.robertifyGuild.twenty_four_seven_mode || false;
            default:
                return obj[toggle] || false;
        }
    }

    public switchToggle(toggle: keyof GuildToggles | 'autoplay' | 'twenty_four_seven_mode', innerToggle?: keyof GuildDJToggles | keyof GuildLogToggles) {
        switch (toggle) {
            case "dj_toggles": {
                if (!innerToggle) return;

                const obj = this.robertifyGuild.toggles;
                if (!(innerToggle in obj.dj_toggles)) return;
                return this.setCurrentData(prev => ({
                    ...prev,
                    toggles: {
                        ...prev.toggles,
                        dj_toggles: {
                            ...prev.toggles.dj_toggles,
                            [innerToggle as keyof GuildDJToggles]: !prev.toggles.dj_toggles[innerToggle as keyof GuildDJToggles]
                        }
                    }
                }));
            }
            case "log_toggles": {
                if (!innerToggle) return;

                const obj = this.robertifyGuild.toggles;
                if (!(innerToggle in (obj.log_toggles ?? this.genDefaultLogTogglesObject()))) return;
                return this.setCurrentData(prev => {
                        if (prev.toggles.log_toggles)
                            return ({
                                ...prev,
                                toggles: {
                                    ...prev.toggles,
                                    log_toggles: {
                                        ...prev.toggles.log_toggles,
                                        [innerToggle as keyof GuildLogToggles]: !prev.toggles.log_toggles[innerToggle as keyof GuildLogToggles]
                                    }
                                }
                            })
                        else {
                            const defaultLogToggles = this.genDefaultLogTogglesObject();
                            return ({
                                    ...prev,
                                    toggles: {
                                        ...prev.toggles,
                                        log_toggles: {
                                            ...defaultLogToggles,
                                            [innerToggle as keyof GuildLogToggles]: !defaultLogToggles[innerToggle as keyof GuildLogToggles]
                                        }
                                    }
                                }
                            )
                        }
                    }
                );
            }
            case "autoplay": {
                return this.setCurrentData(prev => ({
                    ...prev,
                    autoplay: !prev.autoplay,
                }));
            }
            case "twenty_four_seven_mode": {
                return this.setCurrentData(prev => ({
                    ...prev,
                    twenty_four_seven_mode: !prev.twenty_four_seven_mode,
                }));
            }
            default: {
                return this.setCurrentData(prev => ({
                    ...prev,
                    toggles: {
                        ...prev.toggles,
                        [toggle]: !prev.toggles[toggle]
                    }
                }));
            }
        }
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

    public addLogChannel(id: string) {
        this.setCurrentData(prev => ({
            ...prev,
            log_channel: id
        }))
    }

    public setLocale(locale: LocaleString) {
        this.setCurrentData(prev => ({
            ...prev,
            locale: locale
        }))
    }

    public setTheme(theme: ThemeString) {
        this.setCurrentData(prev => ({
            ...prev,
            theme: theme
        }))
    }

    public removeLogChannel() {
        return this.addLogChannel("-1");
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

    public generateTextChannelContent(selectedKey?: keyof RobertifyGuild) {
        return this.generateChannelContent('text', selectedKey);
    }

    public generateVoiceChannelContent(selectedKey?: keyof RobertifyGuild) {
        return this.generateChannelContent('voice', selectedKey);
    }

    public generateThemesContent(): SelectMenuContent[] {
        const isThemeSelected = (theme: string): boolean => {
            return this.robertifyGuild.theme === theme.toLowerCase().replaceAll(/\s/g, "_");
        }

        const themes = [
            'Green', "Red", "Gold", "Yellow", "Orange", "Dark", "Light", "Blue", "Light Blue", "Pink", "Purple", "Mint", "Pastel Yellow", "Pastel Red", "Pastel Purple", "Baby Blue"
        ]

        return themes.map<SelectMenuContent>(theme => ({
            label: theme,
            value: theme.toLowerCase().replaceAll(/\s/g, "_"),
            selected: isThemeSelected(theme)
        }));
    }

    public generateLocaleContent(): SelectMenuContent[] {
        type Locale = {
            locale: LocaleString,
            icon?: string | StaticImageData
        }

        const isSelected = (locale: Locale) => {
            return this.robertifyGuild.locale === locale.locale;
        }

        const locales: Locale[] = [
            {
                locale: 'english',
            },
            {
                locale: 'spanish',
            },
            {
                locale: 'portuguese',
            },
            {
                locale: 'russian',
            },
            {
                locale: 'dutch',
            },
            {
                locale: 'german',
            },
            {
                locale: 'french',
            },
        ]

        return locales.map<SelectMenuContent>(locale => ({
            label: `${locale.locale.charAt(0).toUpperCase()}${locale.locale.substring(1)}`,
            value: locale.locale,
            icon: locale.icon,
            selected: isSelected(locale)
        }))
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
                    return permissions["1"] ? permissions["1"].includes(role.id.toString()) : false;
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

    private generateChannelContent(channelType: 'voice' | 'text', selectedKey?: keyof RobertifyGuild): SelectMenuContent[] {
        const isChannelSelected = (channel: DiscordGuildChannel) => {
            if (!selectedKey) return false;

            switch (selectedKey) {
                case "restricted_channels": {
                    const obj = this.robertifyGuild.restricted_channels[channelType === 'voice' ? 'voice_channels' : 'text_channels'];
                    if (!obj || obj.length === 0)
                        return false;
                    return obj.includes(channel.id);
                }
                case "log_channel": {
                    if (channelType !== 'text')
                        return false;
                    const obj = this.robertifyGuild.log_channel;
                    if (!obj)
                        return false;
                    return obj === channel.id;
                }
            }
        }

        const convertToSelectMenuContent = (obj: { category: string | undefined, channels: DiscordGuildChannel[] }): SelectMenuContent[] => {
            return obj.channels.map<SelectMenuContent>(channel => {
                return {
                    category: obj.category,
                    label: channel.name || '',
                    value: channel.id,
                    icon: channelType === 'voice' ? discordVoiceChannelIcon : discordTextChannelIcon,
                    selected: isChannelSelected(channel)
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