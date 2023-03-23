'use client';

import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import NavUserProfile from "@/app/_components/nav/nav-user-profile";
import DarkModeSwitcher from "@/app/_components/nav/dark-mode-switcher";
import HyperLink from "@/components/hyperlink";
import {useSession} from "next-auth/react";
import LoginButton from "@/app/_components/nav/login-button";
import GenericImage from "@/app/_components/GenericImage";

export default function NavBar() {
    const [isOpen, setOpen] = useState(false);
    const discordInfo = useSession().data?.user;
    const mobileNavRef = useRef<any>(null);
    const hamburgerRef = useRef<any>(null);

    const toggleOpen = () => {
        setOpen(lastVal => !lastVal);
    }

    useEffect(() => {
        const handle = (event: MouseEvent) => {
            if (mobileNavRef.current && (!mobileNavRef.current.contains(event.target) && !hamburgerRef.current.contains(event.target)))
                setOpen(false);
        }

        document.addEventListener('mousedown', handle);
        return () => {
            document.removeEventListener('mousedown', handle);
        }
    }, [mobileNavRef, hamburgerRef]);

    return (
        <nav className='relative z-50'>
            <div
                ref={hamburgerRef}
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
                    ref={mobileNavRef}
                    className={`flex tablet:flex-col dark:bg-dark/50 backdrop-blur-lg w-full h-20 tablet:h-fit tablet:absolute bg-neutral-100 p-6 transition-fast ${isOpen ? 'tablet:visible' : 'tablet:invisible tablet:opacity-0'}`}>
                    <Link href='/' className={'flex gap-4 justify-center cursor-pointer hover:scale-105 transition-fast'}>
                        <GenericImage
                            className='self-center'
                            src='https://i.imgur.com/fwG8qA5.png'
                            alt='Robertify Logo'
                            width={4}
                        />
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
                                <LoginButton />
                                :
                                <NavUserProfile/>
                        }
                    </div>

                </div>
            }
        </nav>
    )
}