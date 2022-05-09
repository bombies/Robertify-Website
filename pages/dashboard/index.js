
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { fetchDiscordUserInfo } from '../../utils/APIUtils';

export default function Dashboard({ token, discordInfo }) {
    const router = useRouter();
    const [ discordInfoState, setDiscordInfoState ] = useState(discordInfo);

    useEffect(() => {
        if (!discordInfoState) {
            router.push('/');
            return;
        }
    }, [discordInfoState]);

    return (
        <Layout token={token} discordInfo={discordInfoState}>
            <Head>
                <title>{'Robertify - Dashboard'}</title>
            </Head>
            <main>
                Under construction!
            </main>
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    return fetchDiscordUserInfo(req);
}