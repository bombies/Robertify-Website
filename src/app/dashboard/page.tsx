import GuildGrid from "@/app/dashboard/guild-grid";
import {AxiosError} from "axios";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import MiniContent from "@/components/MiniContent";
import {fetchDiscordUserGuilds} from "@/utils/api/api-methods";

export const metadata = {
    title: 'Robertify - Guild List'
}

const getUserGuilds = async (session: Session | null) => {
    if (!session?.user)
        return []
    return await fetchDiscordUserGuilds(session.user);
}

export default async function Dashboard() {
    const guilds = (await getUserGuilds(await getServerSession(authOptions)));

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