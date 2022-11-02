import Layout from "../components/Layout";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {DiscordInfo} from "../utils/Types";
import {fetchAllDiscordUserInfo} from "../utils/APIUtils";
import Hero from "../components/Hero";
import GenericCard from "../components/GenericCard";
import Button from "../components/Button";
import Image from "next/image";
import {robertifyAPI} from "../utils/RobertifyAPI";
import {useMutation} from "@tanstack/react-query";
import WorkerButton from "../components/WorkerButton";
import {useEffect, useState} from "react";
import SelectCard from "../components/SelectCard";

type Props = {
    token: string,
    discordInfo: DiscordInfo,
    guildsInfo: any,
    discordLoginLink: string,
    premiumInfo: any,
    isPremiumUser: boolean,
    robertifyAPICredentials: { uri: string, accessToken: string }
}

const getTierColour = (tier: number): string => {
    switch (tier) {
        case 0: return 'text-orange-400';
        case 1: return 'text-neutral-300';
        case 2: return 'text-amber-400';
        case 3: return 'text-cyan-400';
        case 4: return 'text-lime-500';
        default: return 'text-white';
    }
}

const parseTier = (tier: number): string => {
    switch (tier) {
        case 0: return 'Bronze';
        case 1: return 'Silver';
        case 2: return 'Gold';
        case 3: return 'Diamond';
        case 4: return 'Emerald';
        default: return '???';
    }
}

const getTierMaxServers = (tier: number): number => {
    switch (tier) {
        case 0: return 1;
        case 1: return 3;
        case 2: return 6;
        case 3: return 10;
        case 4: return 15;
        default: return 0;
    }
}

function sortGuilds(guildInfo): any[] {
    return [...guildInfo].sort((a, b) => a.name.localeCompare(b.name));
}

export default function Premium(props: Props) {
    const [ premiumServers, setPremiumServers ] = useState(props.premiumInfo ? props.premiumInfo.premium_servers : []);
    const [ selectedServers, setSelectedServers ] = useState([]);
    const [ selectedRemovalServers, setSelectedRemovalServers ] = useState([]);
    const [ dataChanged, setDataChanged ] = useState(false);

    useEffect(() => {
        setDataChanged(() => {
            return selectedServers.length !== 0 || selectedRemovalServers.length !== 0;
        })
    }, [selectedRemovalServers, selectedServers])

    const cardHeight = 'h-[30rem]';
    const buttonSize = 'md';

    const updatePremiumServers = useMutation(servers => {
        if (!props.robertifyAPICredentials.uri) return;

        // @ts-ignore
        return robertifyAPI.addPremiumServersManual(
            props.robertifyAPICredentials.uri,
            props.robertifyAPICredentials.accessToken,
            props.discordInfo.id,
            servers
        ).then(() => {
            setPremiumServers(servers);
            setSelectedRemovalServers([]);
            setSelectedServers([]);
        });
    });

    const guildCards = props.guildsInfo ? sortGuilds(props.guildsInfo).filter(info => !premiumServers.includes(info.id)).map(info => <SelectCard
        key={info.id}
        text={info.name}
        icon={info.icon ? `https://cdn.discordapp.com/icons/${info.id}/${info.icon}.webp?size=512` : 'https://i.robertify.me/images/rykx6.png'}
        onClick={() => {
            if (selectedServers.includes(info.id))
                setSelectedServers(oldSelectedServers => oldSelectedServers.filter(id => id !== info.id));
            else
                setSelectedServers(oldSelectedServers => [ ...oldSelectedServers, info.id ]);
        }}
        isSelected={selectedServers.includes(info.id)}
    />) : [];

    const premiumGuildCards = props.guildsInfo ? sortGuilds(props.guildsInfo).filter(info => premiumServers.includes(info.id)).map(info => <SelectCard
        key={info.id}
        text={info.name}
        icon={info.icon ? `https://cdn.discordapp.com/icons/${info.id}/${info.icon}.${info.icon.startsWith('a_') ? 'gif' : 'webp'}?size=512` : 'https://i.robertify.me/images/rykx6.png'}
        onClick={() => {
            if (selectedRemovalServers.includes(info.id))
                setSelectedRemovalServers(oldSelectedServers => oldSelectedServers.filter(id => id !== info.id));
            else
                setSelectedRemovalServers(oldSelectedServers => [ ...oldSelectedServers, info.id ]);
        }}
        isSelected={selectedRemovalServers.includes(info.id)}
        isDisabled={true}
    />) : []

    const discordAvatar = props.discordInfo ? Object.keys(props.discordInfo).length ? `https://cdn.discordapp.com/avatars/${props.discordInfo.id}/${props.discordInfo.avatar}.${props.discordInfo.avatar.startsWith('a_') ? 'gif' : 'webp'}?size=512` : null : null;

    // @ts-ignore
    return (
        <Layout token={props.token} title='Robertify - Premium' discordInfo={props.discordInfo} discordLoginLink={props.discordLoginLink} >
            <main className='bg-neutral-900 overflow-hidden'>
                <Hero title='Premium' subTitle='Fully experience what we have to offer...'></Hero>
                {
                    props.isPremiumUser ?
                        <div className='py-16'>
                            <div className='items-center'>
                                <h1 className='text-5xl phone:text-2xl font-bold uppercase text-center'><span className='text-lime-400'>{props.discordInfo.username}</span>, welcome back!</h1>
                                <h3 className='text-center text-xl phone:text-lg text-neutral-300 mb-12'>Your premium experience awaits...</h3>
                                <div className='bg-blurred w-full p-16 laptop:p-8 tablet:p-4 phone:p-0 phone:py-6'>
                                    <div className='flex phone:justify-center bg-neutral-800 rounded-xl mb-12 p-6 phone:py-6 phone:px-2 w-5/6 mx-auto'>
                                        <div className='relative w-32 h-32 tablet:h-24 tablet:w-24 phone:w-16 phone:h-16 self-center rounded-full shadow-xl border-2 border-lime-500 ml-6 phone:ml-0'>
                                            <Image src={discordAvatar} alt='Discord Avatar' layout='fill' objectFit='cover' className='rounded-full shadow-xl' />
                                        </div>
                                        <div className='self-center ml-12 phone:ml-2'>
                                            <h1 className='text-4xl tablet:text-2xl phone:text-xl text-lime-200 font-medium'>{`${props.discordInfo.username}#${props.discordInfo.discriminator}`}</h1>
                                            <h1 className='text-xl tablet:text-lg phone:text-sm'>Tier: <span className={`${getTierColour(props.premiumInfo.premium_tier)} uppercase font-medium`}>{parseTier(props.premiumInfo.premium_tier)}</span></h1>
                                            <h1 className='text-xl tablet:text-lg phone:text-sm'>Premium Started: <span className='text-lime-300'>{new Date(Number(props.premiumInfo.premium_started)).toDateString()}</span></h1>
                                            <h1 className='text-xl tablet:text-lg phone:text-sm'>Premium Ends: <span className='text-lime-300'>{new Date(Number(props.premiumInfo.premium_expires)).toDateString()}</span></h1>
                                        </div>
                                    </div>
                                    <div className='bg-neutral-800 rounded-xl p-6 w-5/6 mx-auto'>
                                        <div>
                                            <h1 className='uppercase font-bold text-4xl phone:text-2xl text-lime-400 mb-4'>Your Premium Servers</h1>
                                            {premiumGuildCards.length === 0 ?
                                                <div className='bg-neutral-900 rounded-xl p-12 tablet:p-6 mb-6'>
                                                    <h3 className='text-3xl tablet:text-xl'>You have no premium servers...</h3>
                                                </div>
                                                :
                                                <div className='grid grid-cols-4 laptop:grid-cols-3 tablet:grid-cols-2 phone:grid-cols-1 gap-x-4 gap-y-2 mb-6'>
                                                    {premiumGuildCards}
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <h1 className='uppercase font-bold text-4xl phone:text-2xl text-lime-400 mb-4'>Set Premium Servers</h1>
                                            <div className='grid grid-cols-4 laptop:grid-cols-3 tablet:grid-cols-2 phone:grid-cols-1 gap-x-4 gap-y-2'>
                                                {guildCards}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <div className={`banner-lg sticky-bottom bg-dark ${dataChanged ? 'active' : 'inactive'} z-50`}>
                                    <p>Careful - You have unsaved changes!</p>
                                    { premiumServers.length + selectedServers.length - selectedRemovalServers.length > getTierMaxServers(props.premiumInfo.premium_tier) &&
                                        <p className='text-red-400'>{`You can only select ${getTierMaxServers(props.premiumInfo.premium_tier)} premium server(s)!`}</p>
                                    }
                                    <WorkerButton
                                        onClick={() => {
                                            let serversToSet = premiumServers.filter(server => !selectedRemovalServers.includes(server))
                                            serversToSet = [...serversToSet, ...selectedServers];
                                            updatePremiumServers.mutate(serversToSet.filter(server => server !== 'server'))
                                        }}
                                        text='Save'
                                        colour='bg-lime-600'
                                        isWorking={updatePremiumServers.isLoading}
                                        icon='https://i.robertify.me/images/htbv7.png'
                                        isDisabled={premiumServers.length + selectedServers.length - selectedRemovalServers.length > getTierMaxServers(props.premiumInfo.premium_tier)}
                                    />
                                </div>
                            </div>

                        </div>
                        :
                        <div>
                            <div className='subscribe shadow-lg' id='subscribe'>
                                <fieldset className='border-gradient-green px-6 pb-6 rounded-2xl bg-blurred'>
                                    <legend className='text-center font-bold text-9xl tablet:text-8xl phone:text-6xl drop-shadow-lg uppercase tracking-[.45em] text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-lime-500 animate-text'>Tiers</legend>
                                    <div className='grid grid-cols-5 tablet:grid-cols-2 phone:grid-cols-1 place-items-center gap-6'>
                                        <GenericCard
                                            coverImage='https://i.imgur.com/VkLGW0b.png'
                                            title='Bronze'
                                            titleColor='text-orange-300'
                                            subTitle='$3.99/mo.'
                                            subTitleColour='text-orange-400'
                                            contentList={['1 Premium Server', 'Full Premium Access']}
                                            maxHeight={cardHeight}
                                            buttons={[{
                                                text: 'Subscribe',
                                                colour: 'bg-orange-400',
                                                href: 'https://www.patreon.com/join/robertify/checkout?rid=8723682',
                                                size: buttonSize
                                            }]}
                                        />
                                        <GenericCard
                                            coverImage='https://i.imgur.com/eKM574t.png'
                                            title='Silver'
                                            titleColor='text-neutral-300'
                                            subTitle='$5.99/mo'
                                            subTitleColour='text-neutral-400'
                                            contentList={['3 Premium Servers', 'Full Premium Access']}
                                            maxHeight={cardHeight}
                                            buttons={[{
                                                text: 'Subscribe',
                                                colour: 'bg-neutral-400',
                                                href: 'https://www.patreon.com/join/robertify/checkout?rid=8723681',
                                                size: buttonSize
                                            }]}
                                        />
                                        <GenericCard
                                            coverImage='https://i.imgur.com/t3oEYn1.png'
                                            title='Gold'
                                            titleColor='text-amber-500'
                                            subTitle='$7.99/mo'
                                            subTitleColour='text-amber-400'
                                            contentList={['6 Premium Servers', 'Full Premium Access']}
                                            maxHeight={cardHeight}
                                            buttons={[{
                                                text: 'Subscribe',
                                                colour: 'bg-amber-500',
                                                href: 'https://www.patreon.com/join/robertify/checkout?rid=8723676',
                                                size: buttonSize
                                            }]}
                                        />
                                        <GenericCard
                                            coverImage='https://i.imgur.com/cGDz0bM.png'
                                            title='Diamond'
                                            titleColor='text-cyan-300'
                                            subTitle='$8.99/mo'
                                            subTitleColour='text-cyan-400'
                                            contentList={['10 Premium Servers', 'Full Premium Access']}
                                            maxHeight={cardHeight}
                                            buttons={[{
                                                text: 'Subscribe',
                                                colour: 'bg-cyan-500',
                                                href: 'https://www.patreon.com/join/robertify/checkout?rid=8723675',
                                                size: buttonSize
                                            }]}
                                        />
                                        <GenericCard
                                            coverImage='https://i.imgur.com/qYPa0Cd.png'
                                            title='Emerald'
                                            titleColor='text-lime-300'
                                            subTitle='$9.99/mo'
                                            subTitleColour='text-lime-400'
                                            contentList={['15 Premium Servers', 'Full Premium Access']}
                                            maxHeight={cardHeight}
                                            buttons={[{
                                                text: 'Subscribe',
                                                colour: 'bg-lime-600',
                                                href: 'https://www.patreon.com/join/robertify/checkout?rid=8571635',
                                                size: buttonSize
                                            }]}
                                        />
                                    </div>
                                </fieldset>
                            </div>
                            <div className='px-12 bg-neutral-800'>
                                <h1 className='uppercase text-7xl phone:text-5xl font-bold text-center mt-10 pt-5 pb-10 text-transparent bg-clip-text bg-gradient-to-tr from-green-400 to-lime-400 animate-text drop-shadow-lg'>But what do I get?</h1>
                                <div className='flex phone:block justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                                    <div className='relative rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 h-[35rem] tablet:w-4/6 phone:w-full'>
                                        <Image src='https://i.imgur.com/mMxjx8V.gif' alt='Themes Examples' layout='fill' objectFit='contain' className='rounded-xl drop-shadow-lg' />
                                    </div>
                                    <div className='my-auto'>
                                        <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Show off your colours with themes</h3>
                                        <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>There are up to 16 colour choices for you to choose from with Robertify Premium! Enjoy listening to your music in style with your favourite colour.</p>
                                    </div>
                                </div>
                                <div className='flex phone:block flex-row-reverse justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                                    <div className='relative rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 h-[35rem] tablet:w-4/6 phone:w-full'>
                                        <Image src='https://i.imgur.com/Vf2W9S0.gif' alt='Favourite Tracks Examples' layout='fill' objectFit='contain' className='rounded-xl drop-shadow-lg' />
                                    </div>
                                    <div className='my-auto'>
                                        <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Save your favourite tracks</h3>
                                        <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Save a track as one of your favourites! Once saved, you can add this track to the queue any time you&apos;d like! All it takes is one click.</p>
                                    </div>
                                </div>
                                <div className='flex phone:block justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                                    <div className='relative rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 h-[35rem] tablet:w-4/6 phone:w-full'>
                                        <Image src='https://i.imgur.com/QDr0lGq.gif' alt='Filters Example' layout='fill' objectFit='contain' className='rounded-xl drop-shadow-lg' />
                                    </div>
                                    <div className='my-auto'>
                                        <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Have fun with Audio Filters</h3>
                                        <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Shake up how you listen to music on Robertify with 5 exciting audio filters. You get to choose to listen to music with the 8D, Karaoke, Tremolo, Vibrato and Nightcore filters!</p>
                                    </div>
                                </div>
                                <div className='flex phone:block flex-row-reverse justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                                    <div className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 h-[17rem] tablet:w-1/2 phone:w-full'>
                                        <Image src='https://i.imgur.com/h16tz9W.png' alt='Auto Play Example' layout='fill' objectFit='cover' className='rounded-xl drop-shadow-lg' />
                                    </div>
                                    <div className='my-auto'>
                                        <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400 max-w-2xl'>A listening experience made just for you with AutoPlay</h3>
                                        <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>On the ending of your queue Robertify will automatically continue playing songs just like the ones you were playing!</p>
                                    </div>
                                </div>
                                <div className='flex phone:block justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                                    <div className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 h-[17rem] tablet:w-1/2 phone:w-full'>
                                        <Image src='https://i.imgur.com/uUdnrgf.png' alt='24/7 Example' layout='fill' objectFit='cover' className='rounded-xl drop-shadow-lg' />
                                    </div>
                                    <div className='my-auto'>
                                        <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Never stop the fun with 24/7 mode</h3>
                                        <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Robertify will always stay in a voice channel with 24/7 mode enabled. Enjoy your listening experience. All. Week. Long.</p>
                                    </div>
                                </div>
                                <div className='flex phone:block flex-row-reverse justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-24'>
                                    <div className='relative rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 h-[35rem] tablet:w-4/6 phone:w-full'>
                                        <Image src='https://i.imgur.com/gU1ERCM.gif' alt='Volume Control Example' layout='fill' objectFit='contain' className='rounded-xl drop-shadow-lg' />
                                    </div>
                                    <div className='my-auto'>
                                        <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400 max-w-2xl'>Control the volume for everyone with global volume control</h3>
                                        <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Music being too loud? Robertify premium allows you to adjust the volume of the bot for every single user in your server.</p>
                                    </div>
                                </div>
                                <div className='flex phone:block justify-center gap-x-32 tablet:gap-x-16 pb-24'>
                                    <img  className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 tablet:w-1/2 phone:w-full' src='https://i.imgur.com/qSPmGJB.png' />
                                    <div className='my-auto'>
                                        <h3 className='text-4xl tablet:text-3xl phone:text-xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400 max-w-3xl'>Share Robertify with more of your community with more instances</h3>
                                        <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Robertify Premium grants you access to more Robertify bots! More of your community members will be able to enjoy the amazing and immersive features of Robertify.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='text-center py-12'>
                                <h1 className='uppercase text-7xl tablet:text-5xl font-bold mt-6 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-lime-400'>Ready to go premium?</h1>
                                <p className='text-2xl phone:text-lg max-w-xl mx-auto mb-12'>Click on the button below to start choosing your desired tier! We are excited to have you join the premium family.</p>
                                <Button href='#subscribe' text='SUBSCRIBE' colour='bg-lime-500'size='lg' center={true} />
                            </div>
                        </div>
                }
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const data = await fetchAllDiscordUserInfo(req);
    const discordLoginLink = `https://discord.com/api/oauth2/authorize?client_id=${atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])}&redirect_uri=${encodeURI(process.env.LOCAL_API_HOSTNAME + '/callback/discord')}&response_type=code&scope=identify%20guilds`;
    const premiumInfo = data.props.userInfo ? await robertifyAPI.getPremiumUser(data.props.userInfo.id) : null;
    const isPremiumUser = premiumInfo === null ? false : !!premiumInfo;
    const hostedAPIName = process.env.HOSTED_API_HOSTNAME;
    const accessToken = await robertifyAPI.getAccessToken();

    return {
        props: {
            token: data.props.token || null,
            discordInfo: data.props.userInfo || null,
            guildsInfo: data.props.guildInfo || null,
            discordLoginLink: discordLoginLink,
            premiumInfo: premiumInfo,
            isPremiumUser: isPremiumUser,
            robertifyAPICredentials: {
                uri: hostedAPIName,
                accessToken: accessToken
            }
        }
    }
}