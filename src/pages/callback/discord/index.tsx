import {useRouter} from "next/router";
import {useEffect} from "react";
import {GetStaticProps} from "next";
import WebClient from "../../../utils/api/web-client";
import {nanoid} from "nanoid";
import jsCookie from 'js-cookie';

type Props = {
    discordClientID: string,
    discordClientSecret: string,
    apiMasterPassword: string,
    localAPIHostname: string,
}

const getQuery = (key: string, path: string) => {
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

export default function Callback(props: Props) {
    const router = useRouter();
    const code = getQuery("code", router.asPath);
    const error = getQuery("error", router.asPath);

    useEffect(() => {
        if (error || !code) {
            router.push('/');
            return;
        }

        if (!props.discordClientID || !props.discordClientSecret || !process.env.NEXT_PUBLIC_DISCORD_LOGIN_REDIRECT_URI || !props.apiMasterPassword || !props.localAPIHostname) {
            router.push('/');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const data = {
            'client_id': props.discordClientID,
            'client_secret': props.discordClientSecret,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.NEXT_PUBLIC_DISCORD_LOGIN_REDIRECT_URI!
        }

        WebClient.getInstance()
            .then(axiosInstance => {
                axiosInstance.post('https://discord.com/api/v10/oauth2/token?=', new URLSearchParams(data).toString(), config)
                    .then(res => {
                        const id = nanoid(8);
                        jsCookie.set('login-token', id)
                        return {id: id, data: {...res.data}}
                    })
                    .then(data => {
                        axiosInstance.post('/api/discord', data)
                            .then(res => res.data)
                            .then((data) => {
                                router.push('/');
                            })
                            .catch(err => console.error(err))
                    })
                    .catch(err => {
                        console.error(err);
                    })
            });

    }, [code, error, props.discordClientID, props.discordClientSecret, props.apiMasterPassword, props.localAPIHostname, router]);

    return (
        <main></main>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            discordClientID: process.env.DISCORD_CLIENT_ID || null,
            discordClientSecret: process.env.DISCORD_CLIENT_SECRET || null,
            apiMasterPassword: process.env.API_MASTER_PASSWORD || null,
            localAPIHostname: process.env.LOCAL_API_HOSTNAME || null
        }
    }
}