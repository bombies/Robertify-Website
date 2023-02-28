import WebClient from "../utils/web-client";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";

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
            <div className='p-64'>
                <h1>Customizable Request Channel</h1>
            </div>
        </main>
    )
}
