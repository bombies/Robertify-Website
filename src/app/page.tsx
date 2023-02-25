import WebClient from '../utils/web-client';
import {Suspense} from "react";


const getRandomJoke = async () => {
    const res = await WebClient.get('https://icanhazdadjoke.com/');

    if (!res.data)
        throw new Error("Couldn't fetch random joke!");
    return res.data;
}

async function RandomDadJoke() {
    const joke = await getRandomJoke();
    return (
        <div className='p-6 bg-white/50 rounded-xl backdrop-blur-lg'>
            <p className='text-3xl'>{joke.joke}</p>
        </div>
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
                <Suspense fallback={<p className='text-3xl'>Dad joke loading...</p>}>
                    <RandomDadJoke />
                </Suspense>
            </div>
        </main>
    )
}
