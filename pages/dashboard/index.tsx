
import jsCookie from 'js-cookie';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GuildCard from '../../components/dashboard/GuildCard';
import Layout from '../../components/Layout';
import { fetchAllDiscordUserInfo } from '../../utils/APIUtils';

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
    const router = useRouter();

    useEffect(() => {
        if (guildsInfo) {
            if (!Object.keys(guildsInfo).length) {
                jsCookie.remove('login-token');
                router.push('/')
            }
        }
    }, [])

    let guildInfoParsed;
    if (guildsInfo) {
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

    const [ pageState, setPageState ] = useState({
        discordInfo: discordInfo,
        guildsInfo: guildInfoParsed,
        searchText: ''
    });

    const discordInfoState = pageState.discordInfo;

    const updateSearchText = (event) => {
        const { value } = event.target;
        const newGuildItems = guildInfoParsed.filter(guildObj => guildObj.props.guildName.toLowerCase().includes(value.toLowerCase()))
        setPageState(oldPageState => ({
            ...oldPageState,
            guildsInfo: value ? [...newGuildItems] : guildInfoParsed, 
            searchText: value
        }))
    }

    useEffect(() => {
        if (!discordInfoState) {
            jsCookie.remove('login-token');
            router.push('/');
        }
    }, [discordInfoState, pageState.guildsInfo]);

    return (
        <Layout token={token} discordInfo={discordInfoState} title='Robertify - Dashboard' showLogin={true}>
            <main className='guildCards--body'>
                <h1 className='text-6xl phone:text-3xl uppercase font-bold text-center text-green-400'>Your Servers</h1>
                <h2 className='text-2xl phone:text-lg text-center text-neutral-400 my-5 italic'>Configure any one to your heart&apos;s desire...</h2>
                <input 
                    className='w-1/2 phone:w-5/6 h-4 self-center mb-3 py-8 phone:py-6 px-8 phone:px-6 rounded-md outline-0 bg-neutral-800 text-white placeholder-neutral-500 text-2xl phone:text-xl border-0 drop-shadow-lg mb-6 transition-all duration-500 ease-in-out focus:outline-green-500 focus:outline-1 focus:outline'
                    type='text'
                    placeholder='Search...'
                    value={pageState.searchText}
                    onInput={updateSearchText}
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