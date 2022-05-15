import axios from 'axios';
import jsCookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Callback(props) {
    const router = useRouter();
    const { code, error } = router.query;

    useEffect(() => {
        if (error) {
            router.push('/');
            return;
        }

        if (!code) {
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

        axios.post('https://discord.com/api/v10/oauth2/token', new URLSearchParams(data), config)
            .then(res => {
                const id = nanoid(8);
                jsCookie.set('login-token', id)
                return {id: id, data: {...res.data}}
            })
            .then(data => {
                axios.post(`${props.localAPIHostname}/api/discord`, data, {
                    headers: {
                        'master-password': props.apiMasterPassword
                    }
                })
                    .then(res => res.data)
                    .then(router.push('/'))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

    }, [code, props.discordClientID, props.discordClientSecret, props.apiMasterPassword]);

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
            apiMasterPassword: process.env.API_MASTER_PASSWORD,
            localAPIHostname: process.env.LOCAL_API_HOSTNAME
        }
    }
}