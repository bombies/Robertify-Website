import WebClient from "../utils/web-client";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import BasicContent from "@/app/_components/baisc-content";
import Image from "next/image";
import reqChannel from '/public/reqchannel.png';
import features from '/public/features.png';

const getRandomJoke = async () => {
    const res = await WebClient.instance()
        .get('https://icanhazdadjoke.com/');
    return res.data;
}

async function RandomDadJoke() {
    const joke = await getRandomJoke();
    return (
        <p className='text-3xl tablet:text-2xl dark:text-white'>{joke.joke}</p>
    );
}

export default async function Home() {
    return (
        <main className={'min-h-screen'}>
            <div className='m-auto default-bg text-center pointer-events-none p-32 phone:px-8 phone:py-32'>
                <h1 className='text-white font-black uppercase text-7xl phone:text-5xl tracking-[0.5rem] phone:tracking-[0.25rem] mb-6 mx-auto'>Robertify</h1>
                <h3 className='text-white font-light text-2xl phone:text-xl tracking-wide mb-6 max-w-2xl mx-auto'>A discord music bot that with a multitude of features that will fit your liking.</h3>
                <div className='flex phone:flex-col gap-6 pointer-events-auto justify-center'>
                    <Button label='INVITE' className='phone:mx-auto' type={ButtonType.INVERTED} width={10} height={3} href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK} />
                    <Button label='LEARN MORE' className='phone:mx-auto' type={ButtonType.INVERTED} width={10} height={3} href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK} />
                </div>
            </div>

            <div className='p-32 laptop:p-16 tablet:p-4 phone:p-2'>
                <BasicContent
                    title='Customizable Request Channel'
                    description='Interact with your music in a unique and fashionable way! The request channel comes with player control buttons which allow for the easy control of Robertify&apos;s player. These buttons can even be toggled on or off, catering to your needs.'

                >
                    <div className='relative w-[30rem] laptop:h-[20rem] h-[30rem] laptop:w-[20rem] self-center'>
                        <Image src={reqChannel} alt='' fill={true} />
                    </div>
                </BasicContent>
                <BasicContent
                    title='So many more features...'
                    description='There are over 60 commands Robertify offers. With fun features like 8ball ranging to robust audio commands like searching and setting favourite tracks, it&apos;s all up to you to take advantage of them!'
                    childrenAlign='left'
                >
                    <div className='relative w-[36rem] laptop:w-[26rem] h-[30rem] laptop:h-[20rem] self-center'>
                        <Image src={features} alt='' fill={true} />
                    </div>
                </BasicContent>
            </div>
        </main>
    )
}
