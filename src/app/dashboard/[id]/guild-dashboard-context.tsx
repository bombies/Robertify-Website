'use client';

import {DiscordGuild, DiscordGuildChannel, RobertifyGuild} from "@/pages/api/discord/users/[id]/guilds";
import {useRouter} from "next/navigation";
import Image from "next/image";
import backIcon from '/public/go-back.svg';
import Link from "next/link";
import DashboardSection from "@/app/dashboard/[id]/DashboardSection";
import DashboardSectionContent from "@/app/dashboard/[id]/DashboardSectionContent";
import SelectMenu from "@/components/select-menu/SelectMenu";

type Props = {
    id: string,
    discordGuildInfo: DiscordGuild,
    discordGuildChannels: DiscordGuildChannel[]
    robertifyGuildInfo: RobertifyGuild,
}

export default function GuildDashboardContext(props: Props) {
    const router = useRouter();

    if (!props.discordGuildInfo || !props.robertifyGuildInfo || !props.discordGuildChannels) {
        router.push(`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=269479308656&scope=bot%20applications.commands&redirect_uri=${encodeURI(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot%20applications.commands&guild_id=${props.id}&disable_guild_select=true`);
        return (<div></div>)
    }

    return (
        <div>
            <div className='mx-auto mb-12 p-12 bg-primary/10 shadow-md dark:bg-neutral-900/90 w-3/4 h-42 backdrop-blur-xl rounded-2xl border-2 border-primary/90'>
                <Link href='/dashboard'>
                    <div className='flex gap-4 hover:scale-[100.25%] transition-fast mb-12'>
                        <div className='relative w-8 h-8'>
                            <Image draggable={false} src={backIcon} alt='' fill={true} />
                        </div>
                        <p className='relative self-center text-primary font-semibold text-xl'>Return to your servers</p>
                    </div>
                </Link>
                <div className='flex gap-12'>
                    <div className='relative w-32 h-32 rounded-full border-2 border-primary'>
                        <Image
                            draggable={false}
                            className='rounded-full'
                            src={props.discordGuildInfo.icon ? `https://cdn.discordapp.com/icons/${props.discordGuildInfo.id}/${props.discordGuildInfo.icon}.webp?size=512` : 'https://i.imgur.com/k14Qfh5.png'}
                            alt=''
                            fill={true}
                        />
                    </div>
                    <h1 className='text-5xl font-bold text-primary self-center'>{props.discordGuildInfo.name}</h1>
                </div>
            </div>
            <div className='mx-auto mb-12 p-12 bg-primary/10 shadow-md dark:bg-neutral-900/90 w-3/4 min-h-42 backdrop-blur-xl rounded-2xl border-2 border-primary/90'>
                <DashboardSection title='Management'>
                    <div className='grid grid-cols-2 gap-6'>
                        <DashboardSectionContent
                            title='DJ Roles'
                            description='Set DJ roles.'
                            contentAlign='below'
                        >
                            <SelectMenu
                                placeholder='Select a role...'
                                content={[
                                    {
                                        label: 'Owner',
                                        value: '1234434'
                                    },
                                    {
                                        label: 'Admin',
                                        value: '1234434'
                                    },
                                    {
                                        category: 'Losers',
                                        label: 'Pleb',
                                        value: '1234434'
                                    },
                                    {
                                        category: 'Losers',
                                        label: 'Super Pleb',
                                        value: '1234434'
                                    },
                                    {
                                        category: 'Kings',
                                        label: 'Me',
                                        value: '1234434'
                                    },
                                    {
                                        category: 'Kings',
                                        label: 'You',
                                        value: '1234434'
                                    },
                                    {
                                        category: 'Kings',
                                        label: 'We',
                                        value: '1234434'
                                    },
                                ]}
                            />
                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='DJ Roles'
                            description='Set DJ roles.'
                        >

                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='DJ Roles'
                            description='Set DJ roles.'
                        >

                        </DashboardSectionContent>
                        <DashboardSectionContent
                            title='DJ Roles'
                            description='Set DJ roles.'
                        >

                        </DashboardSectionContent>
                    </div>
                </DashboardSection>
            </div>
        </div>
    )
}