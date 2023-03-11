'use client';

import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {DiscordInfo, useDiscordData} from "@/app/_components/discord-data-context";
import NavUserProfile from "@/app/_components/nav/nav-user-profile";
import DarkModeSwitcher from "@/app/_components/nav/dark-mode-switcher";
import Button from "@/components/button/Button";
import login from '/public/login.svg';
import HyperLink from "@/components/hyperlink";

export default function NavBar({discordInfo}: { discordInfo?: DiscordInfo }) {
    const [isOpen, setOpen] = useState(false);
    const [, setDiscordInfo] = useDiscordData();

    useEffect(() => {
        if (discordInfo)
            setDiscordInfo(discordInfo);
    }, [discordInfo, setDiscordInfo])

    const toggleOpen = () => {
        setOpen(lastVal => !lastVal);
    }

    return (
        <nav className='relative z-50'>
            <div
                className='z-[51] invisible tablet:visible transition-fast absolute top-5 left-5 flex flex-col gap-[.15rem] w-8 h-12 cursor-pointer'
                onClick={toggleOpen}>
                <div
                    className={'rounded-full h-[.25rem] transition-fast ' + (isOpen ? 'bg-primary' : 'bg-white dark:bg-neutral-900')}></div>
                <div
                    className={'rounded-full h-[.25rem] transition-fast ' + (isOpen ? 'bg-primary' : 'bg-white dark:bg-neutral-900')}></div>
                <div
                    className={'rounded-full h-[.25rem] transition-fast ' + (isOpen ? 'bg-primary' : 'bg-white dark:bg-neutral-900')}></div>
            </div>
            {
                <div
                    className={`flex tablet:flex-col dark:bg-dark/50 backdrop-blur-lg w-full h-20 tablet:h-fit tablet:absolute bg-neutral-100 p-6 transition-fast ${isOpen ? 'tablet:visible' : 'tablet:invisible tablet:opacity-0'}`}>
                    <Link href='/' className={'flex gap-4 justify-center cursor-pointer hover:scale-105 transition-fast'}>
                        <div className='relative w-16 h-16 self-center'>
                            <Image draggable={false} src='https://i.imgur.com/fwG8qA5.png' alt='Robertify Logo' fill={true}/>
                        </div>
                        <h1 className='uppercase font-black text-3xl self-center tracking-widest text-primary my-auto'>Robertify</h1>
                    </Link>
                    <div
                        className='self-center mx-auto flex gap-16 tablet:gap-8 tablet:text-center tablet:flex-col tablet:mb-6 dark:text-white'>
                        <HyperLink href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK || ''} >INVITE</HyperLink>
                        <HyperLink href='/commands'>COMMANDS</HyperLink>
                        <HyperLink href='/vote'>VOTE</HyperLink>
                        <HyperLink href='/support'>SUPPORT</HyperLink>
                    </div>
                    <div className='flex gap-4'>
                        <DarkModeSwitcher/>
                        {
                            !discordInfo ?
                                <Button
                                    className='self-center mx-auto'
                                    width={8}
                                    height={3}
                                    href={process.env.NEXT_PUBLIC_DISCORD_LOGIN_LINK}
                                    label='Login'
                                    icon={login}
                                />
                                :
                                <NavUserProfile/>
                        }
                    </div>

                </div>
            }
        </nav>
    )
}