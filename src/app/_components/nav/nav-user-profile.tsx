'use client';

import {useDiscordData} from "@/app/_components/discord-data-context";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import LogoutButton from "@/app/_components/nav/logout-button";
import logout from '/public/logout.svg';

export default function NavUserProfile() {
    const [expanded, setExpanded] = useState(false);
    const [discordInfo,] = useDiscordData()
    const wrapperRef = useRef<any>(null);
    const miniViewRef = useRef<any>(null);
    const toggleExpanded = () => {
        setExpanded(prev => !prev);
    }

    useEffect(() => {
        const handle = (event: MouseEvent) => {
            if (wrapperRef.current && (!wrapperRef.current.contains(event.target) && !miniViewRef.current.contains(event.target))) {
                setExpanded(false);
            }
        }

        document.addEventListener('mousedown', handle);
        return () => {
            document.removeEventListener('mousedown', handle);
        }
    }, [wrapperRef, miniViewRef]);

    const avatar = discordInfo ? `https://cdn.discordapp.com/avatars/${discordInfo.id}/${discordInfo.avatar}.${discordInfo.avatar.startsWith('a_') ? 'gif' : 'webp'}?size=512` : 'https://i.imgur.com/fwG8qA5.png';

    return (
        <div ref={miniViewRef} className='mx-auto'>
            <div className='relative'>
                <div
                    className='flex gap-4 cursor-pointer hover:scale-105 transition-faster'
                    onClick={toggleExpanded}
                >
                    <div className='relative w-8 h-8 self-center'>
                        <Image src={avatar} alt='Discord User Avatar' fill={true} className='rounded-full'/>
                    </div>
                    <p className='self-center text-primary font-semibold'>{discordInfo?.username}#{discordInfo?.discriminator}</p>
                </div>
                <div
                    ref={wrapperRef}
                    className='absolute dark:bg-neutral-800/80 mt-4 mr-2 left-[-3rem] z-50 w-56 p-6 h-fit bg-neutral-100/80 shadow-md backdrop-blur-md rounded-xl drop-shadow-lg transition-faster border-[1px] border-primary'
                    style={{
                        display: expanded ? 'inherit' : 'none'
                    }}
                >
                    {
                        discordInfo &&
                        <div>
                            <div
                                className='relative w-24 h-24 mb-4 self-center border-2 border-primary rounded-full shadow-glow-primary-lg mx-auto mb-6'>
                                <Image src={avatar} alt='Discord User Avatar' fill={true} className='rounded-full'/>
                            </div>
                            <p className='self-center text-primary text-center text-xl drop-shadow-md font-semibold pointer-events-none mb-6'>{discordInfo?.username}#{discordInfo?.discriminator}</p>
                        </div>
                    }
                    <LogoutButton/>
                </div>
            </div>
        </div>
    )
}