import WebClient from "../utils/web-client";
import {Suspense} from "react";
import { RefreshJoke } from "./_components/refresh-joke";
import { DadJokeProvider } from "./_components/dad-joke-context";

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
                <h1 className='text-white font-black uppercase text-7xl phone:text-5xl tracking-[0.5rem] phone:tracking-[0.25rem] mb-6'>Robertify</h1>
                <h3 className='text-white text-3xl tracking-wide'>A next-gen music bot</h3>
            </div>
        </main>
    )
}
