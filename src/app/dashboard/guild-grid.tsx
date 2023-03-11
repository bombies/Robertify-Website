'use client';

import {useEffect, useState} from "react";
import Image from "next/image";
import searchIcon from "../../../public/search.svg";
import InputContext from "@/components/input-context";
import GuildCard from "@/app/dashboard/guild-card";
import Card from "@/components/card";
import {DiscordUserGuild} from "@/pages/api/discord/users/[id]/guilds";

type Props = {
    guilds: DiscordUserGuild[]
}

const filterGuilds = (guilds: JSX.Element[], filter: string) => {
    if (!filter || filter === '')
        return guilds;
    return guilds.filter(guild => guild.props.name.toLowerCase().startsWith(filter.toLowerCase()));
}

const isServerAdmin = (guild: DiscordUserGuild) => {
    return (Number(guild.permissions) & (1 << 5)) === (1 << 5) || (Number(guild.permissions) & (1 << 3)) === (1 << 3);
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
    if (!props.guilds) {
        return (
            <Card
                centered
                size='lg'
                title='No servers founds...'
                description="Uh oh! It seems I couldn't find any servers you're in. :("
            />
        )
    }

    const guildCards = sortGuilds(props.guilds)?.map(guild => <GuildCard
        key={guild.id}
        id={guild.id}
        name={guild.name}
        icon={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=512` : undefined}
        isOwner={guild.owner}
        isAdmin={isServerAdmin(guild)}
    />)
    const [visibleGuilds, setVisibleGuilds] = useState(guildCards);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setVisibleGuilds(filterGuilds(guildCards, searchValue));
    }, [searchValue])

    return (
        <div>
            <div className='flex justify-center'>
                <InputContext
                    onChange={(e) => {
                        setSearchValue(e.target.value)
                    }}
                    value={searchValue}
                    size='xl'
                    placeholder='Search...'
                    contentRight={<div className='relative w-6 h-6'><Image src={searchIcon} alt='' fill={true}/></div>}
                    aria-label='search-input'
                />
            </div>
            {
                visibleGuilds.length ?
                    <div
                        className='grid grid-cols-3 dark:bg-neutral-900/50 bg-neutral-600/5 backdrop-blur-lg rounded-xl p-6 phone:p-3 laptop-big:grid-cols-2 phone:grid-cols-1  mt-6 place-items-center gap-6 phone:gap-3 w-2/3 tablet: w-5/6 mx-auto'>
                        {visibleGuilds}
                    </div>
                    :
                    <Card className='mt-12' centered size='sm' title='Uh oh!'
                          description={`I couldn't find any guilds that you're in with the name ${searchValue}. :(`}/>
            }
        </div>
    )
}