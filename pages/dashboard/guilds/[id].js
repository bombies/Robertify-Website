import Layout from "../../../components/Layout";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchDiscordUserInfo } from '../../../utils/APIUtils';
import Link from 'next/link';

export default function GuildPage({ token, discordInfo }) {
    const router = useRouter();
    const { id } = router.query;

    const [ discordInfoState, setDiscordInfoState ] = useState(discordInfo);
    
    useEffect(() => {
        if (!discordInfoState) {
            router.push('/');
            return;
        }
    }, [discordInfoState]);

    return (
        <Layout token={token} discordInfo={discordInfoState} >
            <Link href='/dashboard'>Go back to your servers</Link>
            <div>{id}</div>
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    return fetchDiscordUserInfo(req);
}