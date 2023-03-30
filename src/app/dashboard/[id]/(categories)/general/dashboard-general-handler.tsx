import {
    RequestChannelConfig,
    DiscordGuildChannel,
    DiscordRole,
    GuildDJToggles,
    GuildLogToggles,
    GuildPermissions,
    GuildToggles,
    LocaleString,
    RobertifyGuild,
    ThemeString
} from "@/utils/discord-types";
import {SelectMenuContent} from "@/components/SelectMenu";
import discordVoiceChannelIcon from "../../../../../../public/discord-voice-channel.svg";
import discordTextChannelIcon from "../../../../../../public/discord-text-channel.svg";
import Toggle from "@/components/toggle";
import DashboardSectionContent from "@/app/dashboard/[id]/(categories)/dashboard-section-content";
import {StaticImageData} from "next/image";
import britain from '/public/locale/britain.svg';
import spain from '/public/locale/spain.svg';
import portugal from '/public/locale/portugal.svg';
import france from '/public/locale/france.svg';
import russia from '/public/locale/russia.svg';
import netherlands from '/public/locale/netherlands.svg';
import germany from '/public/locale/germany.svg';
import disconnect from '/public/reqchannel/disconnect.svg';
import favourite from '/public/reqchannel/favourite.svg';
import filters from '/public/reqchannel/filters.svg';
import loop from '/public/reqchannel/loop.svg';
import play_and_pause from '/public/reqchannel/pnp.svg';
import previous from '/public/reqchannel/previous.svg';
import rewind from '/public/reqchannel/rewind.svg';
import shuffle from '/public/reqchannel/shuffle.svg';
import skip from '/public/reqchannel/skip.svg';
import stop from '/public/reqchannel/stop.svg';
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import AbstractDashboardHandler, {AbstractDashboardFields} from "@/app/dashboard/[id]/(categories)/abstract-dashboard-handler";

type RequestChannelButton = keyof RequestChannelConfig

type RequestChannelButtonMetaData = {
    id: number,
    label: string,
    key: string,
    icon: string | StaticImageData,
    type: ButtonType.BLUE | ButtonType.GREY | ButtonType.DANGER
}
export default class DashboardGeneralHandler extends AbstractDashboardHandler{

    constructor(opts: AbstractDashboardFields) {
        super(opts);
    }

    private getButtonMetaData(button: RequestChannelButton): RequestChannelButtonMetaData {
        switch (button) {
            case "disconnect":
                return {
                    id: 10,
                    label: "Disconnect",
                    key: button,
                    icon: disconnect,
                    type: ButtonType.DANGER
                };
            case "favourite":
                return {
                    id: 6,
                    label: "Favourite",
                    key: button,
                    icon: favourite,
                    type: ButtonType.GREY
                };
            case "filters":
                return {
                    id: 9,
                    label: "Filters",
                    key: button,
                    icon: filters,
                    type: ButtonType.GREY
                };
            case "previous":
                return {
                    id: 1,
                    label: "Previous",
                    key: button,
                    icon: previous,
                    type: ButtonType.BLUE
                };
            case "rewind":
                return {
                    id: 2,
                    label: "Rewind",
                    key: button,
                    icon: rewind,
                    type: ButtonType.BLUE
                };
            case "shuffle":
                return {
                    id: 8,
                    label: "Shuffle",
                    key: button,
                    icon: shuffle,
                    type: ButtonType.GREY
                };
            case "loop":
                return {
                    id: 7,
                    label: "Loop",
                    key: button,
                    icon: loop,
                    type: ButtonType.GREY
                };
            case "play_pause":
                return {
                    id: 3,
                    label: "Play and Pause",
                    key: button,
                    icon: play_and_pause,
                    type: ButtonType.BLUE
                };
            case "skip":
                return {
                    id: 5,
                    label: "Skip",
                    key: button,
                    icon: skip,
                    type: ButtonType.BLUE
                };
            case "stop":
                return {
                    id: 4,
                    label: "Stop",
                    key: button,
                    icon: stop,
                    type: ButtonType.BLUE
                };
        }
    }

    public generateReqChannelButtons() {
        const config = this.opts.robertifyGuild?.dedicated_channel.config || this.getDefaultButtonStates();

        return Object.keys(config).map((key) => {
            const metaData = this.getButtonMetaData(key as RequestChannelButton);

            return ({
                id: metaData.id,
                element: <Button
                    key={key}
                    disabled={!this.opts.canInteract}
                    label={metaData.label}
                    icon={metaData.icon}
                    type={metaData.type}
                    height={3}
                    className={(!config[key as RequestChannelButton] ? 'dark:brightness-[60%] brightness-[75%]' : '') + ' !w-full'}
                    onClick={() => this.toggleReqChannelButton(key as RequestChannelButton)}
                />
            })
        })
            .sort((a, b) => a.id - b.id)
            .map(e => e.element);
    }

    private getDefaultButtonStates(): RequestChannelConfig {
        return {
            previous: true,
            rewind: true,
            play_pause: true,
            stop: true,
            skip: true,
            favourite: true,
            loop: true,
            shuffle: true,
            filters: false,
            disconnect: true,
        }
    }

    public toggleReqChannelButton(button: RequestChannelButton) {
        if (!this.setCurrentData)
            return;
        if (!this.opts.canInteract)
            return;

        const defaultButtonStates: RequestChannelConfig = this.getDefaultButtonStates();

        return this.setCurrentData(prev => {
            if (!prev) return;

            const configToUse = this.opts.robertifyGuild?.dedicated_channel.config || defaultButtonStates;

            return ({
                ...prev,
                dedicated_channel: {
                    ...prev.dedicated_channel,
                    config: {
                        ...configToUse,
                        [button]: !configToUse[button]
                    }
                }
            })
        })
    }

    public generateDJToggleElements() {
        const obj = this.opts.robertifyGuild?.toggles.dj_toggles;
        if (!obj)
            return [];

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
                        disabled={!this.opts.canInteract}
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
        let obj = this.opts.robertifyGuild?.toggles.log_toggles ?? this.genDefaultLogTogglesObject();
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
                        disabled={!this.opts.canInteract}
                    />
                </DashboardSectionContent>
            ));
    }

    public getToggle(toggle: keyof GuildToggles | 'autoplay' | 'twenty_four_seven_mode', innerToggle?: keyof GuildDJToggles | keyof GuildLogToggles) {
        const obj = this.opts.robertifyGuild?.toggles;
        if (!obj)
            return false;
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
                return this.opts.robertifyGuild?.autoplay || false;
            case "twenty_four_seven_mode":
                return this.opts.robertifyGuild?.twenty_four_seven_mode || false;
            default:
                return obj[toggle] || false;
        }
    }

    public switchToggle(toggle: keyof GuildToggles | 'autoplay' | 'twenty_four_seven_mode', innerToggle?: keyof GuildDJToggles | keyof GuildLogToggles) {
        if (!this.isUsable()) return;

        switch (toggle) {
            case "dj_toggles": {
                if (!innerToggle) return;

                const obj = this.opts.robertifyGuild?.toggles;
                if (!obj) return;

                if (!(innerToggle in obj.dj_toggles)) return;
                return this.setCurrentData(prev => {
                    if (!prev) return;
                    return ({
                        ...prev,
                        toggles: {
                            ...prev.toggles,
                            dj_toggles: {
                                ...prev.toggles.dj_toggles,
                                [innerToggle as keyof GuildDJToggles]: !prev.toggles.dj_toggles[innerToggle as keyof GuildDJToggles]
                            }
                        }
                    })
                });
            }
            case "log_toggles": {
                if (!innerToggle) return;

                const obj = this.opts.robertifyGuild?.toggles;
                if (!obj) return;

                if (!(innerToggle in (obj.log_toggles ?? this.genDefaultLogTogglesObject()))) return;
                return this.setCurrentData(prev => {
                        if (!prev) return;
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
                return this.setCurrentData(prev => {
                    if (!prev) return;
                    return ({
                        ...prev,
                        autoplay: !prev.autoplay,
                    })
                });
            }
            case "twenty_four_seven_mode": {
                return this.setCurrentData(prev => {
                    if (!prev) return;

                    return ({
                        ...prev,
                        twenty_four_seven_mode: !prev.twenty_four_seven_mode,
                    })
                });
            }
            default: {
                return this.setCurrentData(prev => {
                    if (!prev) return;
                    return ({
                        ...prev,
                        toggles: {
                            ...prev.toggles,
                            [toggle]: !prev.toggles[toggle]
                        }
                    })
                });
            }
        }
    }

    public addDJRole(id: string) {
        if (!this.setCurrentData) return;
        if (!this.opts.canInteract) return;

        this.setCurrentData(prev => {
            if (!prev) return;
            return ({
                ...prev,
                permissions: {
                    ...prev.permissions,
                    "1": prev.permissions["1"] ? [...prev.permissions["1"], id] : [id]
                }
            })
        })
    }

    public removeDJRole(id: string) {
        if (!this.setCurrentData) return;
        if (!this.opts.canInteract) return;

        this.setCurrentData(prev => {
            if (!prev) return;
            return ({
                ...prev,
                permissions: {
                    ...prev.permissions,
                    "1": prev.permissions["1"] ? prev.permissions["1"]?.filter(permission => permission !== id) : []
                }
            })
        })
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
        if (!this.setCurrentData) return;
        if (!this.opts.canInteract) return;

        this.setCurrentData(prev => {
            if (!prev) return;
            return ({
                ...prev,
                log_channel: id
            })
        })
    }

    public setLocale(locale: LocaleString) {
        if (!this.setCurrentData) return;
        if (!this.opts.canInteract) return;

        this.setCurrentData(prev => {
            if (!prev) return;
            return ({
                ...prev,
                locale: locale
            })
        })
    }

    public setTheme(theme: ThemeString) {
        if (!this.setCurrentData) return;
        if (!this.opts.canInteract) return;

        this.setCurrentData(prev => {
            if (!prev) return;
            return ({
                ...prev,
                theme: theme
            })
        })
    }

    public removeLogChannel() {
        return this.addLogChannel("-1");
    }

    private addRestrictedChannel(id: string, channelType: 'text' | 'voice') {
        if (!this.setCurrentData) return;
        if (!this.opts.canInteract) return;

        switch (channelType) {
            case "text": {
                this.setCurrentData(prev => {
                    if (!prev) return;
                    return ({
                        ...prev,
                        restricted_channels: {
                            ...prev.restricted_channels,
                            text_channels: prev.restricted_channels.text_channels ? [...prev.restricted_channels.text_channels, id] : [id]
                        }
                    })
                });
                break;
            }
            case "voice": {
                this.setCurrentData(prev => {
                    if (!prev) return;
                    return ({
                        ...prev,
                        restricted_channels: {
                            ...prev.restricted_channels,
                            voice_channels: prev.restricted_channels.voice_channels ? [...prev.restricted_channels.voice_channels, id] : [id]
                        }
                    })
                });
                break;
            }
        }
    }

    private removeRestrictedChannel(id: string, channelType: 'text' | 'voice') {
        if (!this.setCurrentData) return;
        if (!this.opts.canInteract) return;

        switch (channelType) {
            case "text": {
                this.setCurrentData(prev => {
                    if (!prev) return;
                    return ({
                        ...prev,
                        restricted_channels: {
                            ...prev.restricted_channels,
                            text_channels: prev.restricted_channels.text_channels ? prev.restricted_channels.text_channels.filter(channel => channel !== id) : []
                        }
                    })
                });
                break;
            }
            case "voice": {
                this.setCurrentData(prev => {
                    if (!prev) return;
                    return ({
                        ...prev,
                        restricted_channels: {
                            ...prev.restricted_channels,
                            voice_channels: prev.restricted_channels.voice_channels ? prev.restricted_channels.voice_channels.filter(channel => channel !== id) : []
                        }
                    })
                });
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
            return this.opts.robertifyGuild?.theme === theme.toLowerCase().replaceAll(/\s/g, "_");
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
            return this.opts.robertifyGuild?.locale === locale.locale;
        }

        const locales: Locale[] = [
            {
                locale: 'english',
                icon: britain
            },
            {
                locale: 'spanish',
                icon: spain
            },
            {
                locale: 'portuguese',
                icon: portugal
            },
            {
                locale: 'russian',
                icon: russia
            },
            {
                locale: 'dutch',
                icon: netherlands
            },
            {
                locale: 'german',
                icon: germany
            },
            {
                locale: 'french',
                icon: france
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
        if (!this.opts.discordGuild?.roles) return [];
        const isRoleSelected = (role: DiscordRole): boolean => {
            if (!selectedKey) return false;
            if (!this.opts.robertifyGuild) return false;
            const obj = this.opts.robertifyGuild[selectedKey];
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

        return this.opts.discordGuild?.roles.map<SelectMenuContent>(role => ({
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
                    const obj = this.opts.robertifyGuild?.restricted_channels[channelType === 'voice' ? 'voice_channels' : 'text_channels'];
                    if (!obj || obj.length === 0)
                        return false;
                    return obj.includes(channel.id);
                }
                case "log_channel": {
                    if (channelType !== 'text')
                        return false;
                    const obj = this.opts.robertifyGuild?.log_channel;
                    if (!obj)
                        return false;
                    return obj === channel.id;
                }
            }
        }

        const convertToSelectMenuContent = (obj: { category: string | undefined, channels?: DiscordGuildChannel[] }): SelectMenuContent[] => {
            if (!obj.channels) return []
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
        return contents.reduce((previousValue, currentValue) => ([
            ...previousValue, ...currentValue
        ]), [])
    }

    private extractChannelsWithCategories(channelType: 'voice' | 'text') {
        if (!this.opts.guildChannels) return [];

        const noCategoryChannels = this.opts.guildChannels?.filter(channel => !channel.parent_id && (channel.type === (channelType === 'voice' ? 2 : 0)))

        return [
            ...this.opts.guildChannels?.filter(channel => channel.type === 4)
                .map(category => {
                    return {
                        name: category.name,
                        id: category.id
                    }
                })
                .map(category => {
                    return {
                        category: category.name,
                        channels: this.opts.guildChannels?.filter(channel => (channel.type === (channelType === 'voice' ? 2 : 0)) && channel.parent_id === category.id)
                    }
                })
                .filter(categoryObj => categoryObj.channels?.length !== 0),
            {
                category: undefined,
                channels: [...noCategoryChannels]
            }
        ]
    }
}