import jsCookie from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import NextNProgress from 'nextjs-progressbar';
import { useState, useEffect } from 'react';

export default function Layout({ token, discordInfo, title, showLogin = true, showFooter = true, children }) {
    const [ layoutInfo, setLayoutInfo ] = useState({
        discordInfo: {...discordInfo},
        userPopoutShown: false,
        loggedOut: true
    });

    const discordInfoObj = layoutInfo.discordInfo;
    const userPopoutShown = layoutInfo.userPopoutShown;

    // Nav Click Event 
    useEffect(() => {
        const menu = document.getElementById('nav--items-mobile');
        const menuLinks = document.getElementById('nav--items-desktop-list');

        const clickFun = () => {
            menu.classList.toggle('is-active');
            menuLinks.classList.toggle('active');
        }

        menu.addEventListener('click', clickFun)

        return () => menu.removeEventListener('click', clickFun)
    }, [])

    const discordAvatar = discordInfoObj ? Object.keys(discordInfoObj).length ? `https://cdn.discordapp.com/avatars/${discordInfoObj.id}/${discordInfoObj.avatar}.${discordInfoObj.avatar.charAt(0) === 'a' ? 'gif' : 'png'}?size=512` : null : null;
    const loginButton = showLogin ? <li><a className='nav--login-btn' id='login-btn' href='https://discord.com/api/oauth2/authorize?client_id=893558050504466482&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds'><img src='https://i.robertify.me/images/c2n9x.png' alt='Login' /><span>Login</span></a></li> : '';
    
    const toggleUserPopout = () => {
        setLayoutInfo(oldLayoutInfo => ({
            ...oldLayoutInfo,
            userPopoutShown: !oldLayoutInfo.userPopoutShown
        }))
    }

    const logOut = () => {
        jsCookie.remove('login-token');
        setLayoutInfo({
            userPopoutShown: false,
            discordInfo: {},
            loggedOut: true
        })
    }

    return (
        <>
            <Head>
                <title>{title ?? 'React App'}</title>
            </Head>
            <NextNProgress color='#15ff00'/>
           <nav>
                <div className='nav--brand'>
                    <img className='nav--brand-logo' src='https://i.robertify.me/images/0bspn.png' alt='Logo'/>
                    <h1 className='nav--brand-title'><Link href='/'>Robertify</Link></h1>
                </div>
                <div className='nav--items'>
                    <ul className='nav--items-desktop-list' id='nav--items-desktop-list'>
                        {/* <li><Link href='/'>Home</Link></li> */}
                        <li><a href='/invite'>Invite</a></li>
                        <li><a href='https://buy.robertify.me'>Store</a></li>
                        <li><Link href='/commands'>Commands</Link></li>
                        <li><Link href='/vote'>Vote</Link></li>
                        <li><Link href='/support'>Support</Link></li>
                        {
                            discordInfoObj ?
                                !Object.keys(discordInfoObj).length ? 
                                        loginButton 
                                    : 
                                        '' 
                                : loginButton
                        }
                    </ul>
                </div>
                <div className='nav--div-1'>
                    {
                        discordInfoObj ?
                            Object.keys(discordInfoObj).length ? 
                                <div className='nav--user'>
                                    <p className='nav--user-welcome'>Welcome back, <span>{discordInfoObj.username}</span></p>
                                    <img className='nav--user-icon' onClick={toggleUserPopout} src={discordAvatar} alt='Discord User Icon'/>
                                </div>
                            : ''
                        : ''
                    }
                    <div className='nav--items-mobile' id='nav--items-mobile'>
                        <span className='nav--mobile-bar'></span>
                        <span className='nav--mobile-bar'></span>
                        <span className='nav--mobile-bar'></span>
                    </div>
                </div>
                {discordInfoObj && 
                    <div className={`nav--user-popout${ userPopoutShown  ? ' active' : ''}`}>
                        <img className={'nav--user-popout-icon'} src={discordAvatar} alt='Discord User Icon' />
                        <p className='nav--user-popout-icon-username'>{`${discordInfoObj.username}#${discordInfoObj.discriminator}`}</p>
                        <div className='nav--user-popout-options-container'>
                            <ul className='nav--user-popout-options'>
                                <li><Link href='/dashboard'>Servers</Link></li>
                                <hr></hr>
                                <li><span className='nav--user-logout-option' onClick={logOut}>Logout</span></li>
                            </ul>
                        </div>
                    </div>
                }
            </nav>
            <main>
                {children}
            </main> 
            {showFooter &&
                <footer>
                    <div className='footer-brand'>
                        <img className='footer--logo' src='https://i.robertify.me/images/0bspn.png' alt='Footer Logo' />
                        <h1 className='footer--logo-text'>Robertify</h1>
                        <p className='footer--copyright'>Copyright ©️ Robertify 2022</p>
                        <div className='footer--links'>
                            <a className='footer--link-github' href='https://github.com/bombies/Robertify-Bot' target={'_blank'} rel={'noreferrer'}><img src='https://i.robertify.me/images/3ythy.png' alt='Discord'/></a>    
                            <a className='footer--link-discord' href='https://robertify.me/invite' target={'_blank'} rel={'noreferrer'}><img src='https://i.robertify.me/images/2n1nb.png' alt='Discord'/></a>    
                        </div>
                    </div>
                    <div className='footer-info'>
                        <div className='footer-info--resources'>
                            <h3 className='footer-info--resources-heading'>Resouces</h3>
                            <ul className='footer--info--resources-list'>
                                <li><Link href='/tos'>Terms of Service</Link></li>
                                <li><Link href='/privacy-policy'>Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </footer>
            }
        </>
    )
}