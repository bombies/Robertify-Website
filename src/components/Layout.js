import React, { useEffect } from 'react';
import { Link } from 'gatsby';

export default function Layout({ children, discordInfo }) {
    // Mobile Navigation Hamburger Click Event
    console.log("Discord info", Object.keys(discordInfo).length)

    useEffect(() => {
        const menu = document.getElementById('nav--items-mobile');
        const menuLinks = document.getElementById('nav--items-desktop-list');
        const nav = document.getElementsByTagName('nav')[0];

        const clickFun = () => {
            menu.classList.toggle('is-active');
            menuLinks.classList.toggle('active');
        }

        menu.addEventListener('click', clickFun)

        return () => {
            menu.removeEventListener('click', clickFun)
        }
    }, []);

    return (
        <>
            <nav>
                <div className='nav--brand'>
                    <img className='nav--brand-logo' src='https://i.robertify.me/images/0bspn.png' alt='Logo'/>
                    <h1 className='nav--brand-title'>Robertify</h1>
                </div>
                <div className='nav--items'>
                    <ul className='nav--items-desktop-list' id='nav--items-desktop-list'>
                        <li><Link to='/'>Home</Link></li>
                        <li><a href='https://buy.robertify.me'>Store</a></li>
                        <li><Link to='/commands'>Commands</Link></li>
                        <li><Link to='/vote'>Vote</Link></li>
                        <li><Link to='/tos'>Terms of Service</Link></li>
                        <li><Link to='/privacy-policy'>Privacy Policy</Link></li>
                        {!Object.keys(discordInfo).length ? <li><button className='nav--login-btn'><img src='https://i.robertify.me/images/c2n9x.png' alt='Login' /><span>Login</span></button></li> : ''}
                    </ul>
                </div>
                <div className='nav--div-1'>
                    {Object.keys(discordInfo).length && <img className='nav--user-icon' src='https://c.tenor.com/sh6zvoaiS10AAAAd/denzel-curry.gif' alt='Discord User Icon' />}
                    <div className='nav--items-mobile' id='nav--items-mobile'>
                        <span className='nav--mobile-bar'></span>
                        <span className='nav--mobile-bar'></span>
                        <span className='nav--mobile-bar'></span>
                    </div>
                </div>
            </nav>
            <main>
                {children}
            </main>
        </>
    );
}