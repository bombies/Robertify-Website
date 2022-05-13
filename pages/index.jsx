import Layout from '../components/Layout';
import Link from 'next/link';
import { fetchDiscordUserInfo } from '../utils/APIUtils';

export default function Home({ token, discordInfo, discordLoginLink }) {
    return (
        <Layout token={token} discordInfo={discordInfo} discordLoginLink={discordLoginLink} title='Robertify - Home Page'>
                <div className='hero'>
                    <h1 className='hero--title'>Robertify</h1>
                    <h3 className='hero--subtitle'>A discord music bot with a multitude of features that will fit your liking!</h3>
                    <div className='hero--buttons'>
                        <Link href='/invite'><span className='hero--button'>Invite</span></Link>
                        <a className='hero--button' href='#aboutUs'>Learn More</a>
                    </div>
                </div>
                <div className='mainContent'>
                    <div className='aboutUs' id='aboutUs'>
                        <img className='aboutUs--img' src='https://i.robertify.me/images/vnjjd.png' alt='Logo' />
                        <div className='aboutUs--desc'>
                            <h2 className='aboutUs--desc-title'>About Us</h2>
                            <p className='aboutUs--desc-body'>Robertify is a music bot programmed completely in Java using JDA. The name &quot;Robertify&quot; originated from the simple fact that a friend of bombies (main Developer) named Robert wanted a music bot, so he made one for him. Eventually, Robertify became his own project to him and he&apos;s been putting in most of his efforts into it ever since.</p>
                        </div>
                    </div>
                    <div className='features'>
                        <div className='features--images'>
                            <img src='https://i.robertify.me/images/xibic.png' alt='Requests Channel' />
                            <img src='https://i.robertify.me/images/kjy0r.png' alt='Toggles' />
                            <img src='https://i.robertify.me/images/ixghm.png' alt='Queue' />
                            <img src='https://i.robertify.me/images/zty1i.png' alt='Restricted Channels' />
                        </div>
                        <div className='features--desc'>
                            <h3>Features</h3>
                            <p className='features--desc-body'>There are so many features and commands jam-packed into Robertify. All of the features provided have been virgoursly tested to ensure the best quality of service for you, our client. Some of these awesome features include:</p>
                            <ul>
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
                                <li><Link href='/commands'>And so much more...</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className='support'>
                        <div className='support--items'>
                            <div className='support--desc'>
                                <h3 className='support--desc-title'>Support</h3>
                                <p className='support--desc-body'>You can always join our <a href='https://robertify.me/support'>support server</a> to ask us questions about anything. You can also suggest new features, report bugs, talk about music and so much more. Don&apos;t be afraid to reach out, we&apos;d love to help you!</p>
                            </div>
                            <img src='https://i.robertify.me/images/o5zcy.png' alt='Support' />
                        </div>
                    </div>
                </div>
                <div className='invite'>
                    <img className='invite--icon' src='https://i.robertify.me/images/bwl3q.png' alt='Invite Icon' />
                    <h1 className='invite--title'>Ready To Invite Us?</h1>
                    <p className='invite--body'>Invite Robertify in seconds by simply clicking on the button below. You&apos;re only one step away from the best listening experience on Discord.</p>
                    <Link className='invite--button' href='/invite'>Invite</Link>
                </div>
        </Layout>
    );
}

export async function getServerSideProps({ req, res }) {
    const data = await fetchDiscordUserInfo(req);

    return {
        props: {
            token: data.props.token || null,
            discordInfo: data.props.discordInfo || null,
            discordLoginLink: process.env.DISCORD_LOGIN_LINK
        }
    }
}
