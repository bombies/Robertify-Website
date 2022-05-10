
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GuildCard from '../../components/dashboard/GuildCard';
import Layout from '../../components/Layout';
import { fetchAllDiscordUserInfo, fetchDiscordUserGuildInfo, fetchDiscordUserInfo } from '../../utils/APIUtils';

function sortGuilds(guildInfo) {
    const alphabeticalSort = [...guildInfo].sort((a,b) => {
        if (
            !a.isOwner && !b.isOwner &&
            (Number(a.permissions) & (1 << 5)) !== (1 << 5)  &&
            (Number(a.permissions) & (1 << 3)) !== (1 << 3) &&
            (Number(b.permissions) & (1 << 5)) !== (1 << 5)  &&
            (Number(b.permissions) & (1 << 3)) !== (1 << 3)
        )
            return a.name.localeCompare(b.name)

        if (a.isOwner && !b.isOwner)
            return -1;
        else if (b.isOwner && !a.isOwner)
            return 1;
        else if (
            ((Number(a.permissions) & (1 << 5)) === (1 << 5) || (Number(a.permissions) & (1 << 3)) === (1 << 3)) 
            && ((Number(b.permissions) & (1 << 5)) !== (1 << 5) && (Number(b.permissions) & (1 << 3)) !== (1 << 3))
        )
            return -1;
        else if (
            ((Number(b.permissions) & (1 << 5)) === (1 << 5) || (Number(b.permissions) & (1 << 3)) === (1 << 3)) 
            && ((Number(a.permissions) & (1 << 5)) !== (1 << 5) && (Number(a.permissions) & (1 << 3)) !== (1 << 3))
        )
            return 1;
        else return 0;
    });
    return alphabeticalSort;
}

export default function Dashboard({ token, discordInfo, guildsInfo }) {

    let guildInfoParsed;
    if (guildsInfo) {
        // console.log(guildsInfo);
        guildInfoParsed = sortGuilds(guildsInfo);
        guildInfoParsed = guildInfoParsed.map(guildObj => <GuildCard
            key={guildObj.id} 
            guildID={guildObj.id}
            guildIcon={guildObj.icon}
            guildName={guildObj.name}
            guildPermissions={Number(guildObj.permissions)}
            isOwner={guildObj.owner}
        />)
    }

    const router = useRouter();
    const [ pageState, setPageState ] = useState({
        discordInfo: discordInfo,
        guildsInfo: guildInfoParsed,
        searchText: ''
    });

    const discordInfoState = pageState.discordInfo;

    const updateSearchText = (event) => {
        const { value } = event.target;
        const newGuildItems = pageState.guildsInfo.filter(guildObj => guildObj.props.guildName.includes(value))
        setPageState(oldPageState => ({
            ...oldPageState,
            guildsInfo: value ? [...newGuildItems] : guildInfoParsed, 
            searchText: value
        }))
    }

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
            <main className='guildCards--body'>
                <input 
                    className='guildCards--search'
                    type='text'
                    placeholder='Search...'
                    value={pageState.searchText}
                    onChange={updateSearchText}
                />
                <div className='guildCards'>
                    {pageState.guildsInfo}
                </div>
            </main>
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    const info = await fetchAllDiscordUserInfo(req)

    return {
        props: {
            token: info.props.token || null,
            discordInfo: info.props.userInfo || null,
            guildsInfo: info.props.guildInfo || null
        }
    }
}