import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import Image from "next/image";
import reqChannel from '/public/reqchannel.png';
import features from '/public/features.png';
import BasicContent from "@/components/baisc-content";
import HeadingSection from "@/components/heading-section";

export default async function Home() {
    return (
        <main className={'min-h-screen'}>
            <HeadingSection heading='Robertify' subheading='A discord music bot that with a multitude of features that will fit your liking.'>
                <div className='flex phone:flex-col gap-6 pointer-events-auto justify-center'>
                    <Button label='INVITE' className='phone:mx-auto' type={ButtonType.INVERTED} width={10} height={3} href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK} />
                    <Button label='LEARN MORE' className='phone:mx-auto' type={ButtonType.INVERTED} width={10} height={3} href='#content' />
                </div>
            </HeadingSection>
            <div className='p-32 laptop:p-16 tablet:p-4 phone:p-2' id='content'>
                <BasicContent
                    title='Customizable Request Channel'
                    description='Interact with your music in a unique and fashionable way! The request channel comes with player control buttons which allow for the easy control of Robertify&apos;s player. These buttons can even be toggled on or off, catering to your needs.'

                >
                    <div className='relative w-[30rem] laptop:h-[20rem] h-[30rem] laptop:w-[20rem] self-center'>
                        <Image
                            draggable={false}
                            src={reqChannel}
                            alt=''
                            fill={true}
                            sizes='
                                (max-width: 1280px) 20rem,
                                30rem
                            '
                        />
                    </div>
                </BasicContent>
                <BasicContent
                    title='So many more features...'
                    description='There are over 60 commands Robertify offers. With fun features like 8ball ranging to robust audio commands like searching and setting favourite tracks, it&apos;s all up to you to take advantage of them!'
                    childrenAlign='left'
                >
                    <div className='relative w-[36rem] laptop:w-[26rem] h-[30rem] laptop:h-[20rem] self-center'>
                        <Image
                            draggable={false}
                            src={features}
                            alt=''
                            fill={true}
                            sizes='
                                (max-width: 1280px) 26rem,
                                36rem
                            '
                        />
                    </div>
                </BasicContent>
            </div>
        </main>
    )
}
