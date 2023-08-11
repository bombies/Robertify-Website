'use client';

import {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import searchIcon from "../../../public/search.svg";
import InputContext from "@/components/input-context";
import GuildCard from "@/app/dashboard/guild-card";
import Card from "@/components/card";
import {DiscordUserGuild, isServerAdmin} from "@/utils/discord-types";
import {signIn, useSession} from "next-auth/react";
import GenericImage from "@/app/_components/GenericImage";
import {Input} from "@nextui-org/react";

type Props = {
    guilds?: DiscordUserGuild[],
    itemsPerPage?: number,
}

const filterGuilds = (guilds: JSX.Element[], filter: string) => {
    if (!filter || filter === '')
        return guilds;
    return guilds.filter(guild => guild.props.name.toLowerCase().startsWith(filter.toLowerCase()));
}

const sortGuilds = (guilds: DiscordUserGuild[]) => {
    if (!guilds)
        return [];
    return guilds.sort((a, b) => {
        if (!a.owner && !b.owner && !isServerAdmin(a) && !isServerAdmin(b))
            return a.name.localeCompare(b.name)

        if (a.owner && !b.owner)
            return -1;
        else if (b.owner && !a.owner)
            return 1;
        else if (
            isServerAdmin(a)
            && !isServerAdmin(b)
        )
            return -1;
        else if (
            isServerAdmin(b)
            && !isServerAdmin(a)
        )
            return 1;
        else return 0;
    });
}

export default function GuildGrid(props: Props) {
    const {data: discordInfo, status} = useSession();

    useEffect(() => {
        if (status !== 'loading' && (status === 'unauthenticated' || !discordInfo))
            signIn('discord', {
                callbackUrl: '/dashboard'
            })
    }, [discordInfo, status])

    const guildCards = useMemo(() => {
        return props.guilds ? sortGuilds(props.guilds)?.map(guild => <GuildCard
            key={guild.id}
            id={guild.id}
            name={guild.name}
            icon={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=512` : undefined}
            isOwner={guild.owner}
            isAdmin={isServerAdmin(guild)}
        />) : []
    }, [props.guilds])
    const [visibleGuilds, setVisibleGuilds] = useState(guildCards);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setVisibleGuilds(filterGuilds(guildCards, searchValue));
    }, [searchValue, guildCards])

    return (
        <div>
            <div className='mx-auto w-1/2'>
                <Input
                    onValueChange={(value) => {
                        setSearchValue(value)
                    }}
                    value={searchValue}
                    size='lg'
                    placeholder='Search...'
                    startContent={<GenericImage src={searchIcon} width={1.5}/>}
                    aria-label='Guild Search Input'
                    classNames={{
                       inputWrapper: "dark:bg-neutral-900/50 border-1 border-black/10 dark:border-white/10"
                    }}
                />
            </div>
            {
                visibleGuilds.length ?
                    <div
                        className='grid grid-cols-3 dark:bg-neutral-900/50 bg-neutral-600/5 rounded-xl p-12 laptop-big:p-6 phone:p-3 laptop:grid-cols-2 phone:grid-cols-1  mt-6 place-items-center gap-6 phone:gap-3 w-5/6 tablet:w-full mx-auto'>
                        {visibleGuilds}
                    </div>
                    :
                    <Card className='mt-12' centered size='sm' title='Uh oh!'
                          description={`I couldn't find any guilds that you're in with the name ${searchValue}. :(`}/>
            }
        </div>
    )
}