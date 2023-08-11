"use client"

import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import reqChannel from '/public/reqchannel.png';
import features from '/public/features.png';
import dashboardImg from '/public/dashboard.png';
import BasicContent from "@/components/baisc-content";
import HeadingSection from "@/components/heading-section";
import GenericImage from "@/app/_components/GenericImage";
import {useRef} from "react";

export default function Home() {
    const contentRef = useRef<HTMLDivElement>(null)

    return (
        <main className={'min-h-screen'}>
            <HeadingSection heading='Robertify'
                            subheading='A discord music bot that with a multitude of features that will fit your liking.'>
                <div className='flex phone:flex-col gap-6 pointer-events-auto justify-center'>
                    <Button
                        label='INVITE'
                        className='phone:mx-auto'
                        type={ButtonType.CTA}
                        width={10}
                        height={3}
                        href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK}
                    />
                    <Button
                        label='LEARN MORE'
                        className='phone:mx-auto'
                        type={ButtonType.INVERTED}
                        width={10}
                        height={3}
                        onClick={() => contentRef.current?.scrollIntoView({
                            behavior: "smooth"
                        })}
                    />
                </div>
            </HeadingSection>
            <div ref={contentRef} className='p-32 laptop:p-16 tablet:p-4' id='content'>
                <BasicContent
                    title='Interactive Dashboard'
                    description="Easily manage the bot without ever running a command. You don't have to worry about digging through help menus and commands to customize the bot exactly how you want it to be for you and your server members."
                    childrenAlign='left'
                >
                    <GenericImage
                        fade
                        className='relative w-[40rem] h-[25rem] phone:w-[22.5rem] phone:h-[15rem] phone:mb-6 self-center'
                        style={{
                            aspectRatio: '1 / 1',
                            objectFit: 'contain'
                        }}
                        src={dashboardImg}
                    />
                </BasicContent>
                <BasicContent
                    title='Customizable Request Channel'
                    description='Interact with your music in a unique and fashionable way! The request channel comes with player control buttons which allow for the easy control of Robertify&apos;s player. These buttons can even be toggled on or off, catering to your needs.'
                >
                    <GenericImage
                        fade
                        className='relative w-[30rem] laptop:h-[20rem] h-[30rem] laptop:w-[20rem] self-center'
                        src={reqChannel}
                    />
                </BasicContent>
                <BasicContent
                    title='So many more features...'
                    description='There are over 60 commands Robertify offers. With fun features like 8ball ranging to robust audio commands like searching and setting favourite tracks, it&apos;s all up to you to take advantage of them!'
                    childrenAlign='left'
                >
                    <GenericImage
                        fade
                        src={features}
                        className='relative w-[36rem] laptop:w-[26rem] h-[30rem] laptop:h-[20rem] phone:w-[20rem] phone:h-[14rem] self-center'
                    />
                </BasicContent>
            </div>
        </main>
    )
}
