'use client';

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import LogoutButton from "@/app/_components/nav/logout-button";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import serverIcon from '/public/server.svg';
import {useSession} from "next-auth/react";
import GenericImage from "@/app/_components/GenericImage";

export default function NavUserProfile() {
    const [expanded, setExpanded] = useState(false);
    const discordInfo = useSession().data?.user;
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

    const avatar = discordInfo && discordInfo.avatar ? `https://cdn.discordapp.com/avatars/${discordInfo.id}/${discordInfo.avatar}.${discordInfo.avatar.startsWith('a_') ? 'gif' : 'webp'}?size=512` : 'https://i.imgur.com/vVJ4UgG.png';

    return (
        <div ref={wrapperRef} className='mx-auto'>
            <div className='relative'>
                <div
                    className='flex gap-4 cursor-pointer hover:scale-105 transition-faster'
                    onClick={toggleExpanded}
                >
                    <GenericImage
                        src={avatar}
                        alt='Discord User Avatar'
                        width={2}
                        imageClassName='self-center rounded-full'
                    />
                    <p className='self-center text-primary font-semibold dark:drop-shadow-glow-primary-lg'>{discordInfo?.username}#{discordInfo?.discriminator}</p>
                </div>
                <div
                    ref={miniViewRef}
                    className='absolute dark:bg-dark/80 shadow-lg dark:shadow-primary/50 shadow-primary/0 mt-4 mr-2 left-[-3rem] z-50 w-56 p-6 h-fit bg-neutral-100/80 shadow-md backdrop-blur-xl rounded-xl transition-faster border-[1px] border-primary'
                    style={{
                        display: expanded ? 'inherit' : 'none'
                    }}
                >
                    {
                        discordInfo &&
                        <div>
                            <GenericImage
                                className='mb-4 self-center border-2 border-primary rounded-full shadow-lg  shadow-primary/0 mx-auto mb-6'
                                imageClassName='rounded-full'
                                src={avatar}
                                width={6}
                            />
                            <p className='self-center text-primary text-center text-xl dark:drop-shadow-glow-primary-lg font-semibold pointer-events-none mb-6'>{discordInfo?.username}#{discordInfo?.discriminator}</p>
                        </div>
                    }
                    <div className='space-y-3'>
                        <Button
                            centered
                            width={6}
                            height={2.5}
                            icon={serverIcon}
                            label='Servers'
                            href='/dashboard'
                            type={ButtonType.PRIMARY}
                        />
                        <LogoutButton/>
                    </div>
                </div>
            </div>
        </div>
    )
}