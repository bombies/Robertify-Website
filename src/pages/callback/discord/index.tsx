import {useRouter} from "next/router";
import {useEffect} from "react";
import {GetStaticProps} from "next";
import WebClient from "../../../utils/web-client";
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
            'redirect_uri': `${props.localAPIHostname}/callback/discord`
        }

        const axiosInstance = WebClient.instance();
        axiosInstance.post('https://discord.com/api/v10/oauth2/token?=', new URLSearchParams(data).toString(), config)
            .then(res => {
                const id = nanoid(8);
                jsCookie.set('login-token', id)
                return {id: id, data: {...res.data}}
            })
            .then(data => {
                axiosInstance.post('/api/discord', data, {
                    headers: {
                        'Authorization': props.apiMasterPassword
                    }
                })
                    .then(res => res.data)
                    .then((data) => {
                        router.push('/');
                    })
                    .catch(err => console.error(err))
            })
            .catch(err => {
                console.error(err);
            })
    }, []);

    return (
        <main></main>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            discordClientID: process.env.DISCORD_CLIENT_ID,
            discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
            apiMasterPassword: process.env.API_MASTER_PASSWORD,
            localAPIHostname: process.env.LOCAL_API_HOSTNAME
        }
    }
}