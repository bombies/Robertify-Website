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
        <p className='text-3xl'>{joke.joke}</p>
    );
}

export default async function Home() {
    return (
        <main className='h-screen flex default-bg'>
            <div className='m-auto text-center pointer-events-none'>
                <p className='text-9xl m-8 drop-shadow-lg animate-wave-normal'>👋</p>
                <p className='text-7xl font-bold text-white mb-5 drop-shadow-lg'>Hey there!</p>
                <p className='text-5xl font-semibold text-neutral-200'>Unfortunately this website is under construction. :(</p>
                <p className='text-5xl font-semibold text-neutral-200'>We know you're sad, so enjoy this dad joke instead!</p>
                <br/>
                <div className='p-6 bg-white/50 rounded-xl backdrop-blur-lg pointer-events-auto'>
                    <DadJokeProvider initialDadJoke={''}>
                        <Suspense fallback={<p className='text-3xl'>Dad joke is loading...</p>}>
                            {/*@ts-ignore*/}
                            <RandomDadJoke />
                            <br/>
                            <RefreshJoke></RefreshJoke>
                        </Suspense>
                    </DadJokeProvider>
                </div>
            </div>
        </main>
    )
}
