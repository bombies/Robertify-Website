import jsCookie from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { useState, useEffect } from 'react';
import {DiscordInfo} from "../utils/Types";

interface Props {
    token?: string,
    discordInfo?: DiscordInfo,
    title: string,
    showLogin?: boolean,
    showFooter?: boolean,
    discordLoginLink?: string,
    stickyFooter?: boolean,
    children: JSX.Element[] | JSX.Element
}

export default function Layout(props: Props) {
    const router: NextRouter = useRouter();
    const [ layoutInfo, setLayoutInfo ] = useState({
        discordInfo: {...props.discordInfo},
        userPopoutShown: false,
        loggedOut: true
    });

    if (!Object.keys(layoutInfo.discordInfo).length) {
        if (props.discordInfo) {
            if (Object.keys(props.discordInfo).length) {
                setLayoutInfo(oldLayoutInfo => ({
                    ...oldLayoutInfo,
                    discordInfo: {...props.discordInfo}
                }));
            }
        }
    }

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

    const discordAvatar = discordInfoObj ? Object.keys(discordInfoObj).length ? `https://cdn.discordapp.com/avatars/${discordInfoObj.id}/${discordInfoObj.avatar}.${discordInfoObj.avatar.startsWith('a_') ? 'gif' : 'webp'}?size=512` : null : null;
    const loginButton = props.showLogin || props.showLogin === undefined ? <li><a className='flex gap-x-2 bg-white p-2 rounded-lg transition-all duration-700 ease-in-out hover:scale-105 cursor-pointer' id='login-btn' href={props.discordLoginLink}><img className='w-8 m-auto' src='https://i.imgur.com/mfzFpni.png' alt='Login' /><p className='self-center text-black uppercase font-med text-xl'>Login</p></a></li> : '';
    
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
            discordInfo: undefined,
            loggedOut: true
        })
        router.reload();
    }

    return (
        <>
            <Head>
                <title>{props.title ?? 'Robertify'}</title>
                <link rel='robertify icon' href='/favicon.ico' />
            </Head>
            <NextNProgress color='rgb(132,204,22)'/>
           <nav>
                <div className='flex cursor-pointer transition-all duration-1000 ease-in-out hover:scale-110'>
                    <Link href='/'><img className='w-24 phone:w-16 mr-5' src='https://i.robertify.me/images/ni48h.png' alt='Logo'/></Link>
                    <h1 className='self-center uppercase text-2xl phone:text-sm tracking-[.25em]'><Link href='/'><span className='text-white font-med'>Robertify</span></Link></h1>
                </div>
                <div className='nav--items'>
                    <ul className='nav--items-desktop-list' id='nav--items-desktop-list'>
                        <li><a href='/invite'>Invite</a></li>
                        <li><Link className='premium' href='/premium'><div className='flex cursor-pointer transition-all duration-1000 ease-in-out hover:scale-105 tablet:justify-center'><img className='w-8 tablet:h-8 self-center' src='https://i.imgur.com/NkPClfS.png' /><span className='self-center text-lime-400 font-med transition-all duration-1000 ease-in-out hover:!text-lime-300'>Premium</span></div></Link></li>
                        <li><Link href='/commands'>Commands</Link></li>
                        <li><Link href='/vote'>Vote</Link></li>
                        <li><Link href='/faq'>Support</Link></li>
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
                                    <p className='nav--user-welcome laptop:hidden' onClick={toggleUserPopout}>Welcome back, <span className='text-lime-500'>{discordInfoObj.username}</span></p>
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
                        <img loading='lazy' decoding='async' className={'nav--user-popout-icon'} src={discordAvatar} alt='Discord User Icon' />
                        <p className='nav--user-popout-icon-username phone:text-sm'>{`${discordInfoObj.username}#${discordInfoObj.discriminator}`}</p>
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
                {props.children}
                {props.showFooter || props.showFooter === undefined &&
                    <footer className={props.stickyFooter ? 'sticky-bottom' : ''}>
                        <div className=''>
                            <img className='w-52 phone:w-16 m-auto' src='https://i.robertify.me/images/ni48h.png' alt='Footer Logo' />
                            <p className='text-sm phone:text-[.55rem] text-center text-neutral-300'>Copyright ©️ Robertify 2022</p>
                            <div className='flex justify-center gap-x-8 phone:gap-x-2 pt-5 phone:pt-2'>
                                <a className='w-8 phone:w-5 transition-all duration-500 ease-in-out hover:brightness-125' href='https://github.com/bombies/Robertify-Bot' target={'_blank'} rel={'noreferrer'}><img loading='lazy' decoding='async' src='https://i.robertify.me/images/3ythy.png' alt='Discord'/></a>
                                <a className='w-8 phone:w-5 transition-all duration-500 ease-in-out hover:brightness-125' href='https://robertify.me/invite' target={'_blank'} rel={'noreferrer'}><img loading='lazy' decoding='async' src='https://i.robertify.me/images/2n1nb.png' alt='Discord'/></a>
                            </div>
                        </div>
                        <div className='footer-info'>
                            <div className='footer-info--resources'>
                                <h3 className='footer-info--resources-heading'>Resources</h3>
                                <ul className='footer--info--resources-list'>
                                    <li><Link href='/tos'>Terms of Service</Link></li>
                                    <li><Link href='/privacy-policy'>Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </footer>
                }
            </main>
        </>
    )
}