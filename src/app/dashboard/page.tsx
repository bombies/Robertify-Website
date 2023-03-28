import GuildGrid from "@/app/dashboard/guild-grid";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {fetchDiscordUserGuilds} from "@/utils/api/api-methods";
import BadgeWrapper from "@/components/BadgeWrapper";
import React from "react";

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
            <div className='flex self-center justify-center gap-4 mb-6'>
                <h1 className='text-primary text-5xl phone:text-3xl drop-shadow-glow-primary-lg text-center self-center'>
                    Welcome to your dashboard
                </h1>
                <BadgeWrapper
                    color='primary'
                    size='sm'
                >BETA</BadgeWrapper>
            </div>
            <GuildGrid guilds={guilds}/>
        </main>
    )
}