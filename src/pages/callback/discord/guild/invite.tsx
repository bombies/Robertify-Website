import {useRouter} from "next/router";
import {useEffect} from "react";

export const getQuery = (key: string, path: string) => {
    const queries = path.split('?');
    if (queries.length < 2)
        return undefined;
    const keyUntrimmed = queries[1].split(key);
    if (keyUntrimmed.length < 2)
        return undefined;
    const keyTrimmed = keyUntrimmed[1].split('=');
    if (keyTrimmed.length < 2)
        return undefined;
    return keyTrimmed[1].split('&')[0];
}

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