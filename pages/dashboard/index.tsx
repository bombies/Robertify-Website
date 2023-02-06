import jsCookie from 'js-cookie';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import GuildCard from '../../components/dashboard/GuildCard';
import Layout from '../../components/Layout';
import {
    fetchAllDiscordUserInfo,
    fetchDiscordGuildInfo,
    fetchDiscordUserGuildInfo,
    fetchDiscordUserInfo
} from '../../utils/APIUtils';
import {useQuery} from "@tanstack/react-query";
import {ImSpinner} from "react-icons/all";
import Spinner from "../../components/Spinner";
import {GetServerSideProps, GetServerSidePropsContext} from "next";

function sortGuilds(guildInfo) {
    if (!guildInfo)
        return [];
    return [...guildInfo].sort((a, b) => {
        if (
            !a.isOwner && !b.isOwner &&
            (Number(a.permissions) & (1 << 5)) !== (1 << 5) &&
            (Number(a.permissions) & (1 << 3)) !== (1 << 3) &&
            (Number(b.permissions) & (1 << 5)) !== (1 << 5) &&
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
}

export default function Dashboard({ login_token, discord_info }) {
    const router = useRouter();
    const discordInfo = useQuery({
        queryKey: ['all_discord_info'],
        queryFn: async () => {
            return fetchDiscordUserGuildInfo(login_token)
        }
    });

    // useEffect(() => {
    //     const guildsInfo = discordInfo.data?.props.guildInfo;
    //     if (guildsInfo && !discordInfo.isLoading) {
    //         console.log("Loaded and yielded no result.")
    //         if (!Object.keys(guildsInfo).length) {
    //             router.push('/').then(() => {
    //                 console.log("Loaded and yielded no result.")
    //             })
    //         }
    //     } else {
    //         console.log("Probably still loading");
    //     }
    // }, [discordInfo])

    let guildInfoParsed;
    if (discordInfo.data) {
        guildInfoParsed = sortGuilds(discordInfo.data.props.guildInfo);
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
        discordInfo: discord_info,
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
        if (!discordInfoState && !discordInfo.isLoading) {
            router.push('/').then(() => {
                console.log("Loaded and yielded no result.")
            });
        } else {
            if (!discordInfo.isLoading) {
                console.log('Finished loading', discordInfo.data)
            } else console.log("Probably still loading");
        }
    }, [discordInfoState, pageState.guildsInfo]);

    return (
        <Layout token={login_token} discordInfo={discord_info} title='Robertify - Dashboard'>
            <main className='guildCards--body'>
                <h1 className='text-6xl phone:text-3xl uppercase font-bold text-center text-lime-400'>Your Servers</h1>
                <h2 className='text-2xl phone:text-lg text-center text-neutral-400 my-5 italic'>Configure any one to your heart&apos;s desire...</h2>
                <input 
                    className='w-1/2 phone:w-5/6 h-4 self-center mb-3 py-8 phone:py-6 px-8 phone:px-6 rounded-md outline-0 bg-neutral-800 text-white placeholder-neutral-500 text-2xl phone:text-xl border-0 drop-shadow-lg mb-6 transition-all duration-500 ease-in-out focus:outline-green-500 focus:outline-1 focus:outline'
                    type='text'
                    placeholder='Search...'
                    value={pageState.searchText}
                    onInput={updateSearchText}
                />
                {
                    discordInfo.isLoading ?
                        <Spinner size={3} /> :
                        <div className='guildCards'>
                            {pageState.guildsInfo}
                        </div>
                }

            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}: GetServerSidePropsContext) => {
    const token = req.cookies['login-token'];
    const data = await fetchDiscordUserInfo(token);

    return {
        props: {
            login_token: token || '',
            discord_info: data.props.discordInfo || null,
        }
    }
}