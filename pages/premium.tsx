import Layout from "../components/Layout";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {DiscordInfo} from "../utils/Types";
import {fetchDiscordUserInfo} from "../utils/APIUtils";
import Hero from "../components/Hero";
import GenericCard from "../components/GenericCard";
import Button from "../components/Button";
import axios, { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import {
    PayPalScriptProvider,
    PayPalButtons,
    FUNDING,
} from '@paypal/react-paypal-js'

type Props = {
    token: string,
    discordInfo: DiscordInfo,
    discordLoginLink: string
}

interface OnApproveData {
    billingToken?: string | null
    facilitatorAccessToken: string
    orderID: string
    payerID?: string | null
    paymentID?: string | null
    subscriptionID?: string | null
    authCode?: string | null
}

export default function Premium(props: Props) {
    const cardHeight = 'h-[30rem]';
    const buttonSize = 'md';

    return (
        <Layout token={props.token} title='Robertify - Premium' discordInfo={props.discordInfo} discordLoginLink={props.discordLoginLink} >
            <main className='bg-neutral-900 overflow-hidden'>
                <Hero title='Premium' subTitle='Coming soon...'></Hero>
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
                                    href: 'nowhere',
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
                                    href: 'nowhere',
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
                                    href: 'nowhere',
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
                                    href: 'nowhere',
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
                                    href: 'nowhere',
                                    size: buttonSize
                                }]}
                            />
                        </div>
                    </fieldset>
                </div>
                <div className='px-12 bg-neutral-800'>
                    <h1 className='uppercase text-7xl phone:text-5xl font-bold text-center mt-10 pt-5 pb-10 text-transparent bg-clip-text bg-gradient-to-tr from-green-400 to-lime-400 animate-text drop-shadow-lg'>But what do I get?</h1>
                    <div className='flex phone:block justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                        <img  className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 tablet:w-4/6 phone:w-full' src='https://i.imgur.com/mMxjx8V.gif' />
                        <div className='my-auto'>
                            <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Show off your colours with themes</h3>
                            <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>There are up to 16 colour choices for you to choose from with Robertify Premium! Enjoy listening to your music in style with your favourite colour.</p>
                        </div>
                    </div>
                    <div className='flex phone:block flex-row-reverse justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                        <img className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 tablet:w-4/6 phone:w-full' src='https://i.imgur.com/Vf2W9S0.gif' />
                        <div className='my-auto'>
                            <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Save your favourite tracks</h3>
                            <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Save a track as one of your favourites! Once saved, you can add this track to the queue any time you&apos;d like! All it takes is one click.</p>
                        </div>
                    </div>
                    <div className='flex phone:block justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                        <img  className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 tablet:w-4/6 phone:w-full' src='https://i.imgur.com/QDr0lGq.gif' />
                        <div className='my-auto'>
                            <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Have fun with Audio Filters</h3>
                            <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Shake up how you listen to music on Robertify with 5 exciting audio filters. You get to choose to listen to music with the 8D, Karaoke, Tremolo, Vibrato and Nightcore filters!</p>
                        </div>
                    </div>
                    <div className='flex phone:block flex-row-reverse justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                        <img className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 tablet:w-1/2 phone:w-full' src='https://i.imgur.com/h16tz9W.png' />
                        <div className='my-auto'>
                            <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400 max-w-2xl'>A listening experience made just for you with AutoPlay</h3>
                            <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>On the ending of your queue Robertify will automatically continue playing songs just like the ones you were playing!</p>
                        </div>
                    </div>
                    <div className='flex phone:block justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-32'>
                        <img  className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 tablet:w-4/6 phone:w-full' src='https://i.imgur.com/uUdnrgf.png' />
                        <div className='my-auto'>
                            <h3 className='text-4xl tablet:text-3xl phone:text-2xl tablet:max-w-md uppercase font-med drop-shadow-lg text-lime-400'>Never stop the fun with 24/7 mode</h3>
                            <p className='max-w-xl tablet:max-w-md text-xl tablet:text-lg text-neutral-200'>Robertify will always stay in a voice channel with 24/7 mode enabled. Enjoy your listening experience. All. Week. Long.</p>
                        </div>
                    </div>
                    <div className='flex phone:block flex-row-reverse justify-center gap-x-32 tablet:gap-x-16 mb-56 tablet:mb-24'>
                        <img className='rounded-xl drop-shadow-lg transition-all duration-700 hover:scale-105 w-1/3 tablet:w-4/6 phone:w-full' src='https://i.imgur.com/gU1ERCM.gif' />
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
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const data = await fetchDiscordUserInfo(req);
    const discordLoginLink = `https://discord.com/api/oauth2/authorize?client_id=${atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])}&redirect_uri=${encodeURI(process.env.LOCAL_API_HOSTNAME + '/callback/discord')}&response_type=code&scope=identify%20guilds`;

    return {
        props: {
            token: data.props.token || null,
            discordInfo: data.props.discordInfo || null,
            discordLoginLink: discordLoginLink
        }
    }
}