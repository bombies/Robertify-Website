import Layout from '../components/Layout';
import Link from 'next/link';
import { fetchDiscordUserInfo } from '../utils/APIUtils';
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {DiscordInfo} from "../utils/Types";
import Hero from "../components/Hero";

type Props = {
    token: string,
    discordInfo: DiscordInfo,
    discordLoginLink: string
}

export default function Home({ token, discordInfo, discordLoginLink }: Props) {
    const heroButtons = [
        {
            name: "Invite",
            href: '/invite',
            isNextButton: true
        },
        {
            name: "Learn More",
            href: '#aboutUs'
        }
    ]

    return (
        <Layout token={token} discordInfo={discordInfo} discordLoginLink={discordLoginLink} title='Robertify - Home Page'>
            <Hero title='Robertify' subTitle='A discord music bot that with a multitude of features that will fit your liking!' buttons={heroButtons}/>
            <div className='mainContent'>
                <div className='aboutUs !bg-neutral-800' id='aboutUs'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className='aboutUs--img' src='https://i.robertify.me/images/vnjjd.png' alt='Logo' />
                    <div className='aboutUs--desc'>
                        <h2 className='uppercase text-8xl phone:text-5xl tablet:mt-4 font-med text-lime-400 drop-shadow-lg'>About Us</h2>
                        <p className='aboutUs--desc-body'>Robertify is a music bot programmed completely in Java using JDA. The name &quot;Robertify&quot; originated from the simple fact that a friend of bombies (main developer) named Robert wanted a music bot, so he made one for him. Eventually, Robertify became his own project to him and he&apos;s been putting in most of his efforts into it ever since.</p>
                    </div>
                </div>
                <div className='features !bg-neutral-700'>
                    <div className='features--images'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src='https://i.robertify.me/images/xibic.png' alt='Requests Channel' />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src='https://i.robertify.me/images/kjy0r.png' alt='Toggles' />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src='https://i.robertify.me/images/ixghm.png' alt='Queue' />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src='https://i.robertify.me/images/zty1i.png' alt='Restricted Channels' />
                    </div>
                    <div className='features--desc'>
                        <h3 className='uppercase text-6xl tablet:mt-4 font-med text-lime-400 drop-shadow-lg'>Features</h3>
                        <p className='features--desc-body'>There are so many features and commands jam-packed into Robertify. All of the features provided have been virgoursly tested to ensure the best quality of service for you, our client. Some of these awesome features include:</p>
                        <ul className='list-disc'>
                            <li>Requests Channels</li>
                            <li>Feature Toggles</li>
                            <li>An amazing queue system</li>
                            <li>Restricted Channels</li>
                            <li>Vote Skipping</li>
                            <li>Auto Play</li>
                            <li>Favourite Tracks</li>
                            <li>Auto Play</li>
                            <li>High Quality, No-Lag Playback</li>
                            <li>Search For Music</li>
                            <li>Precise Lyrics</li>
                            <li>Spotify, Deezer, YouTube and so many more sources</li>
                            <li><Link href='/commands'><span className='text-lime-400 cursor-pointer transition-all duration-200 ease-in-out hover:text-green-300'>And so much more...</span></Link></li>
                        </ul>
                    </div>
                </div>
                <div className='support'>
                    <div className='support--items'>
                        <div className='support--desc'>
                            <h3 className='uppercase text-8xl phone:text-5xl tablet:mt-4 font-med text-lime-400 drop-shadow-lg'>Support</h3>
                            <p className='support--desc-body'>You can always join our <a className='text-lime-400 cursor-pointer transition-all duration-200 ease-in-out hover:text-green-300' href='https://robertify.me/support'>support server</a> to ask us questions about anything. You can also suggest new features, report bugs, talk about music and so much more. Don&apos;t be afraid to reach out, we&apos;d love to help you!</p>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src='https://i.robertify.me/images/o5zcy.png' alt='Support' />
                    </div>
                </div>
            </div>
            <div className='py-32 bg-neutral-800'>
                <h1 className='text-center uppercase text-8xl phone:text-5xl tablet:mt-4 font-med text-lime-400 drop-shadow-lg'>Ready To Invite Us?</h1>
                <p className='text-center text-2xl phone:text-lg max-w-xl mt-3 mx-auto drop-shadow-lg'>Invite Robertify in seconds by simply clicking on the button below. You&apos;re only one step away from the best listening experience on Discord.</p>
                <Link href='/invite'><p className='text-center mt-6 mx-auto w-40 px-6 py-3 bg-lime-600 rounded-lg uppercase text-white font-med text-3xl drop-shadow-lg transition-all ease-in-out duration-500 hover:scale-110 hover:bg-lime-500 hover:drop-shadow-xl'>Invite</p></Link>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({req}: GetServerSidePropsContext) => {
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
