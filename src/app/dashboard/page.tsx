import GuildGrid from "@/app/dashboard/guild-grid";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {fetchDiscordUserGuilds} from "@/utils/api/api-methods";
import React from "react";
import {Chip} from "@nextui-org/chip";

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
            <div className='flex justify-center gap-4 mb-6'>
                <h1 className='text-primary text-3xl phone:text-xl drop-shadow-glow-primary-lg self-center uppercase font-bold !m-0'>
                    Welcome to your dashboard
                </h1>
                <Chip
                    variant="flat"
                    color='primary'
                    size='sm'
                    className="self-center"
                >BETA</Chip>
            </div>
            <GuildGrid guilds={guilds}/>
        </main>
    )
}