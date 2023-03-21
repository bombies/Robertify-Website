import GuildGrid from "@/app/dashboard/guild-grid";
import WebClient from "@/utils/api/web-client";
import {cookies} from "next/headers";
import {AxiosError} from "axios";

const getUserGuilds = async (token?: string) => {
    try {
        return (await (await WebClient.getInstance())
            .get(`/api/discord/users/${token}/guilds`))?.data;
    } catch (e: any) {
        if (e instanceof AxiosError) {
            if (e.response?.data.retry_after) {
                setTimeout(() => {
                    getUserGuilds(token);
                }, e.response.data.retry_after)
            } else if (e.response?.status === 404)
                return Promise.resolve(undefined);
        } else throw e;
    }
}

export default async function Dashboard() {
    const token = cookies().get('login-token')?.value;
    const guilds = (await getUserGuilds(token))?.data;

    return (
        <main className='p-12 phone:px-6 min-h-screen'>
            <h1 className='text-primary text-5xl phone:text-3xl dark:drop-shadow-glow-primary-lg text-center mb-6'>
                Welcome to your dashboard
            </h1>
            <GuildGrid guilds={guilds}/>
        </main>
    )
}