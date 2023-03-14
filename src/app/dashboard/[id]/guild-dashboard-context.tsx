'use client';

import {
    DiscordGuild,
    DiscordGuildChannel,
    DiscordRole,
    GuildPermissions,
    RobertifyGuild
} from "@/utils/discord-types";
import {useRouter} from "next/navigation";
import Image from "next/image";
import backIcon from '/public/go-back.svg';
import Link from "next/link";
import DashboardSection from "@/app/dashboard/[id]/DashboardSection";
import DashboardSectionContent from "@/app/dashboard/[id]/DashboardSectionContent";
import SelectMenu, {SelectMenuContent} from "@/components/select-menu/SelectMenu";
import {useDiscordDataRequired} from "@/app/_components/discord-data-context";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {compare} from "@/utils/general-utils";
import discordVoiceChannelIcon from '/public/discord-voice-channel.svg';
import discordTextChannelIcon from '/public/discord-text-channel.svg';
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";

type Props = {
    id: string,
    discordGuildInfo: DiscordGuild,
    discordGuildChannels: DiscordGuildChannel[]
    robertifyGuildInfo: RobertifyGuild,
}

export default function GuildDashboardContext(props: Props) {
    const router = useRouter();
    const [currentData, setCurrentData] = useState(props.robertifyGuildInfo)
    const [changesMade, setChangesMade] = useState(false);
    const elementParser = new RobertifyGuildElementParser(
        currentData,
        props.discordGuildInfo,
        props.discordGuildChannels,
        setCurrentData,
        setChangesMade,
    );

    useEffect(() => {
        if (!props.discordGuildInfo || !props.robertifyGuildInfo || !props.discordGuildChannels)
            return router.push(`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=269479308656&scope=bot%20applications.commands&redirect_uri=${encodeURI(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot%20applications.commands&guild_id=${props.id}&disable_guild_select=true`);
    }, [])

    useEffect(() => {
        setChangesMade(compareData(currentData, props.robertifyGuildInfo))
    }, [currentData, props.robertifyGuildInfo]);

    if (!useDiscordDataRequired())
        return (<div></div>);

    const saveChanges = () => {
        if (!changesMade)
            return;
        props.robertifyGuildInfo = currentData;
        setChangesMade(false);
    }

    const discardChanges = () => {
        if (!changesMade)
            return;
        setCurrentData(props.robertifyGuildInfo);
    }

    return (
        <div>
            <div className={'fixed rounded-xl w-5/6 bottom-0 mx-auto bg-primary/50 dark:bg-neutral-900/80 backdrop-blur-sm h-20 z-[51] p-6 flex justify-between transition-fast' + (!changesMade ? ' bottom-[-200px]' : '')}>
                <p className='text-white dark:text-primary dark:drop-shadow-glow-primary-lg font-semibold text-2xl self-center'>You have unsaved changes!</p>
                <div className='flex gap-4'>
                    <Button
                        label='Save'
                        width={8}
                        height={3}
                        className='self-center'
                        onClick={saveChanges}
                    />
                    <Button
                        label='Discard'
                        type={ButtonType.DANGER}
                        width={8}
                        height={3}
                        className='self-center'
                        onClick={discardChanges}
                    />
                </div>
            </div>
            <div
                className='mx-auto mb-12 tablet:p-6 p-12 bg-primary/10 shadow-md dark:bg-neutral-900 w-3/4 h-42 rounded-2xl border-2 border-primary/90'>
                <Link href='/dashboard'>
                    <div className='flex gap-4 hover:scale-[100.25%] transition-fast mb-12'>
                        <div className='relative w-8 h-8'>
                            <Image
                                draggable={false}
                                src={backIcon}
                                alt=''
                                fill={true}
                                sizes='2rem'
                            />
                        </div>
                        <p className='relative self-center text-primary font-semibold text-xl phone:text-sm'>Return to
                            your servers</p>
                    </div>
                </Link>
                <div className='flex gap-12'>
                    <div className='relative w-32 h-32 phone:w-16 phone:h-16 rounded-full border-2 border-primary'>
                        <Image
                            draggable={false}
                            className='rounded-full'
                            src={props.discordGuildInfo.icon ? `https://cdn.discordapp.com/icons/${props.discordGuildInfo.id}/${props.discordGuildInfo.icon}.webp?size=512` : 'https://i.imgur.com/k14Qfh5.png'}
                            alt=''
                            fill={true}
                        />
                    </div>
                    <h1 className='text-5xl phone:text-xl font-bold text-primary self-center'>{props.discordGuildInfo.name}</h1>
                </div>
            </div>
            <div
                className='mx-auto mb-12 p-12 tablet:p-6  bg-primary/10 shadow-md dark:bg-neutral-900 w-3/4 min-h-42 rounded-2xl border-2 border-primary/90'>
                <DashboardSection title='Management'>
                    <div className='grid grid-cols-2 tablet:grid-cols-1 gap-6'>
                        <DashboardSectionContent
                            title='DJ Roles'
                            description='Set DJ roles.'
                            contentAlign='below'
                        >
                            <SelectMenu
                                multiSelect
                                placeholder='Select multiple roles'
                                size='sm'
                                content={elementParser.generateRolesContent('permissions')}
                                displayCategories={false}
                                handleItemSelect={(item) => {
                                    elementParser.addDJRole(item.value);
                                }}
                                handleItemDeselect={(item) => {
                                    elementParser.removeDJRole(item.value)
                                }}
                            />
                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='Restricted Voice Channels'
                            description='Set voice channels.'
                            contentAlign='below'
                        >
                            <SelectMenu
                                multiSelect
                                placeholder='Select multiple channels'
                                size='sm'
                                content={elementParser.generateVoiceChannelContent()}
                            />
                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='Restricted Text Channels'
                            description='Set text channels'
                            contentAlign='below'
                        >
                            <SelectMenu
                                multiSelect
                                placeholder='Select multiple channels'
                                size='sm'
                                content={elementParser.generateTextChannelContent()}
                            />
                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='Log Channel'
                            description='Set the channel for Robertify logs to be sent'
                            contentAlign='below'
                        >
                            <SelectMenu
                                placeholder='Select a channel'
                                size='sm'
                                content={elementParser.generateTextChannelContent()}
                            />
                        </DashboardSectionContent>
                    </div>
                </DashboardSection>
            </div>
        </div>
    )
}

class RobertifyGuildElementParser {
    constructor(
        private readonly robertifyGuild: RobertifyGuild,
        private readonly discordGuild: DiscordGuild,
        private readonly guildChannels: DiscordGuildChannel[],
        private readonly setCurrentData: Dispatch<SetStateAction<RobertifyGuild>>,
        private readonly setChangesMade: Dispatch<SetStateAction<boolean>>,
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

const compareData = (cur: RobertifyGuild, original: RobertifyGuild) => {
    return !compare(cur, original);
}
