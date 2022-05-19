import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Props = {
    discordClientID: string,
    discordClientSecret: string,
    localAPIHostname: string  
}

export default function Callback(props: Props) {
    const router = useRouter();
    const { code, guild_id, permissions, error } = router.query;

    useEffect(() => {
        if (error) {
            router.push('/dashboard');
        }

        if (!code) {
            router.push('/dashboard');
        }

        if (code)
            router.push(`/dashboard/guilds/${guild_id}`)
    }, [code, props.discordClientID, props.discordClientSecret]);

    return (
        <main>
        </main>
    )
}

export async function getStaticProps() {
    return { 
        props: { 
            discordClientID: process.env.DISCORD_CLIENT_ID,
            discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
            localAPIHostname: process.env.LOCAL_API_HOSTNAME
        }
    }
}