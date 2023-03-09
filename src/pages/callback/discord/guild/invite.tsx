import {useRouter} from "next/router";
import {useEffect} from "react";
import {getQuery} from "@/pages/callback/discord";

export default function Callback() {
    const router = useRouter();
    const code = getQuery("code", router.asPath);
    const error = getQuery("error", router.asPath);
    const guildId = getQuery("guild_id", router.asPath);

    useEffect(() => {
        if (error) {
            router.push('/dashboard');
            return;
        }

        if (!code) {
            router.push('/dashboard');
            return;
        } else {
            router.push(`/dashboard/${guildId}`)
        }
    }, [code, error, guildId, router])

    return (
        <main></main>
    )
}