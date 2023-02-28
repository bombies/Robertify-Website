'use client';

import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {DiscordInfo, useDiscordData} from "@/app/_components/discord-data-context";
import Button from "@/components/Button";
import NavUserProfile from "@/app/_components/nav/nav-user-profile";
import DarkModeSwitcher from "@/app/_components/nav/dark-mode-switcher";

export default function NavBar({discordInfo}: { discordInfo?: DiscordInfo }) {
    const [isOpen, setOpen] = useState(false);
    const [windowSize, setWindowSize] = useState<[number, number]>([
        window.innerWidth,
        window.innerHeight
    ]);
    const [, setDiscordData] = useDiscordData();

    useEffect(() => {
        if (discordInfo)
            setDiscordData(discordInfo);

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [])

    const toggleOpen = () => {
        setOpen(lastVal => !lastVal);
    }

    return (
        <nav>
            {
                windowSize[0] <= 1025 &&
                <div
                    className='transition-fast absolute top-5 left-5 flex flex-col gap-[.15rem] z-50 w-8 h-12 cursor-pointer'
                    onClick={toggleOpen}>
                    <div
                        className={'rounded-full h-[.25rem] transition-fast ' + (isOpen ? 'bg-primary' : 'bg-white dark:bg-neutral-600')}></div>
                    <div
                        className={'rounded-full h-[.25rem] transition-fast ' + (isOpen ? 'bg-primary' : 'bg-white dark:bg-neutral-600')}></div>
                    <div
                        className={'rounded-full h-[.25rem] transition-fast ' + (isOpen ? 'bg-primary' : 'bg-white dark:bg-neutral-600')}></div>
                </div>
            }
            {
                (isOpen || (windowSize[0] > 1025)) &&
                <div
                    className={'flex tablet:flex-col dark:bg-neutral-800 w-full h-20 tablet:h-fit tablet:absolute z-40 bg-white p-6 transition-fast'}>
                    <Link href='/' className={'flex self-center cursor-pointer hover:scale-105 transition-fast'}>
                        <div className='relative w-16 h-16 self-center'>
                            <Image src='https://i.imgur.com/fwG8qA5.png' alt='Robertify Logo' fill={true}/>
                        </div>
                        <h1 className='uppercase font-black text-3xl self-center text-primary'>Robertify</h1>
                    </Link>
                    <div
                        className='self-center mx-auto flex gap-16 tablet:gap-8 tablet:text-center tablet:flex-col tablet:mb-6 dark:text-white'>
                        <Link href='/'>INVITE</Link>
                        <Link href='/'>COMMANDS</Link>
                        <Link href='/'>VOTE</Link>
                        <Link href='/'>SUPPORT</Link>
                    </div>
                    <div className='flex gap-4'>
                        <DarkModeSwitcher/>
                        {
                            !discordInfo ?
                                <Button
                                    className='self-center'
                                    width={8}
                                    height={3}
                                    href={process.env.NEXT_PUBLIC_DISCORD_LOGIN_LINK}
                                >Login</Button>
                                :
                                <NavUserProfile/>
                        }
                    </div>

                </div>
            }
        </nav>
    )
}