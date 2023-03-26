import GuildGrid from "@/app/dashboard/guild-grid";
import WebClient from "@/utils/api/web-client";
import {AxiosError} from "axios";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import MiniContent from "@/components/MiniContent";

export const metadata = {
    title: 'Robertify - Guild List'
}

const getUserGuilds = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user)
            return []
        return (await WebClient.getInstance(session?.user)
            .get(`/api/discord/user/guilds`)).data
    } catch (e: any) {
        if (e instanceof AxiosError) {
            if (e.response?.data.retry_after) {
                setTimeout(() => {
                    getUserGuilds();
                }, e.response.data.retry_after)
            } else if (e.response?.status === 404)
                return Promise.resolve(undefined);
        } else throw e;
    }
}

export default async function Dashboard() {
    const guilds = (await getUserGuilds())?.data;

    return (
        <main className='p-12 phone:px-6 min-h-screen'>
            <MiniContent content='BETA' className='mx-auto' />
            <h1 className='text-primary text-5xl phone:text-3xl dark:drop-shadow-glow-primary-lg text-center mb-6'>
                Welcome to your dashboard
            </h1>

            <GuildGrid guilds={guilds}/>
        </main>
    )
}