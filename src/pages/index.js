import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Router, Link } from '@reach/router';
import Commands from './commands';
import TermsOfService from './tos';
import PrivacyPolicy from './privacy-policy';
import Vote from './vote';
import Callback from './callback';
import { createClient } from 'redis';

// export const redisClient = Redis.createClient();
export default function Home() {

    const [ userDiscordInfo, setUserDiscordInfo ] = useState({hi: 1});

    return (
        <Layout discordInfo={userDiscordInfo} >
            {/* Setup routes */}
            <Router basepath='/commands'><Commands path='/commands'/></Router>
            <Router basepath='/vote'><Vote path='/vote'/></Router>
            <Router basepath='/tos'><TermsOfService path='/tos'/></Router>
            <Router basepath='/privacy-policy'><PrivacyPolicy path='/privacy-policy'/></Router>

            <Router basepath='/callback'><Callback path='/callback'/></Router>



            <div className='hero'>
                <h1 className='hero--title'>Robertify</h1>
                <h3 className='hero--subtitle'>A discord music bot with a multitude of features that will fit your liking!</h3>
                <div className='hero--buttons'>
                    <a className='hero--button' href='https://robertify.me/invite'>Invite</a>
                    <a className='hero--button' href='#aboutUs'>Learn More</a>
                </div>
            </div>
            <div className='mainContent'>
                <div className='aboutUs' id='aboutUs'>
                    <img className='aboutUs--img' src='https://i.robertify.me/images/vnjjd.png' alt='Logo' />
                    <div className='aboutUs--desc'>
                        <h2 className='aboutUs--desc-title'>About Us</h2>
                        <p className='aboutUs--desc-body'>Robertify is a music bot programmed completely in Java using JDA. The name "Robertify" originated from the simple fact that a friend of bombies (main Developer) named Robert wanted a music bot, so he made one for him. Eventually, Robertify became his own project to him and he's been putting in most of his efforts into it ever since.</p>
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
                        <p className='features--desc-body'>There are so many features and command jam-packed into Robertify. All of the features provided have been virgoursly tested to ensure the best quality of service for you, our client. Some of these awesome features include:</p>
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
                            <li><a href='#'>And so much more...</a></li>
                        </ul>
                    </div>
                </div>
                <div className='support'>
                    <div className='support--items'>
                        <div className='support--desc'>
                            <h3 className='support--desc-title'>Support</h3>
                            <p className='support--desc-body'>You can always join our <a href='https://robertify.me/support'>support server</a> to ask us questions about anything. You can also suggest new features, report bugs, talk about music and so much more. Don't be afraid to reach out, we'd love to help you!</p>
                        </div>
                        <img src='https://i.robertify.me/images/o5zcy.png' alt='Support' />
                    </div>
                </div>
            </div>
            <div className='invite'>
                <img className='invite--icon' src='https://i.robertify.me/images/bwl3q.png' alt='Invite Icon' />
                <h1 className='invite--title'>Ready To Invite Us?</h1>
                <p className='invite--body'>Invite Robertify in seconds by simply clicking on the button below. You're only one step away from the best listening experience on Discord.</p>
                <a className='hero--button' href='https://robertify.me/invite'>Invite</a>
            </div>
            <footer>
                <img className='footer--logo' src='https://i.robertify.me/images/0bspn.png' alt='Footer Logo' />
                <h1 className='footer--logo-text'>Robertify</h1>
                <p className='footer--copyright'>Copyright ©️ Robertify 2022</p>
                <div className='footer--links'>
                    <a className='footer--link-github' href='https://github.com/bombies/Robertify-Bot' target={'_blank'} rel={'noreferrer'}><img src='https://i.robertify.me/images/3ythy.png' alt='Discord'/></a>    
                    <a className='footer--link-discord' href='https://robertify.me/invite' target={'_blank'} rel={'noreferrer'}><img src='https://i.robertify.me/images/2n1nb.png' alt='Discord'/></a>    
                </div>
            </footer>
        </Layout>
    )
}
