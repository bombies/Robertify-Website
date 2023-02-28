'use client';

import {DiscordInfo} from "@/app/_components/discord-data-context";
import Image from "next/image";
import {useState} from "react";
import Button from "@/components/Button";
import LogoutButton from "@/app/_components/nav/logout-button";

export default function NavUserProfile({ discordInfo }: { discordInfo: DiscordInfo }) {
    const [ expanded, setExpanded ] = useState(false);
    const toggleExpanded = () => {
        setExpanded(prev => !prev);
    }

    const avatar = `https://cdn.discordapp.com/avatars/${discordInfo.id}/${discordInfo.avatar}.${discordInfo.avatar.startsWith('a_') ? 'gif' : 'webp'}?size=512`


    return (
        <div className='mx-auto'>
            <div className='relative'>
                <div
                    className='flex gap-4 cursor-pointer hover:scale-105 transition-faster'
                    onClick={toggleExpanded}
                >
                    <div className='relative w-8 h-8 self-center'>
                        <Image src={avatar} alt='Discord User Avatar' fill={true} className='rounded-full' />
                    </div>
                    <p className='self-center text-primary font-semibold'>{discordInfo.username}#{discordInfo.discriminator}</p>
                </div>
                <div
                    className='absolute mt-4 mr-2 left-[-3rem] z-50 w-72 p-6 h-64 bg-neutral-100 rounded-xl drop-shadow-lg transition-faster border-[1px] border-primary pointer-events-none'
                    style={{
                        display: expanded ? 'inherit' : 'none'
                    }}
                >
                    <div className='relative w-24 h-24 mb-4 self-center border-2 border-primary rounded-full drop-shadow-md mx-auto'>
                        <Image src={avatar} alt='Discord User Avatar' fill={true} className='rounded-full' />
                    </div>
                    <p className='self-center text-primary text-center text-xl drop-shadow-md font-semibold'>{discordInfo.username}#{discordInfo.discriminator}</p>
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}