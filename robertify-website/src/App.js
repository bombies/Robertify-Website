import React from 'react';
import './styles.css';

export default function App() {
    return (
        <main>
            <nav>
                <div className='nav--brand'>
                    <img className='nav--brand-logo' src='https://i.robertify.me/images/0bspn.png' alt='Logo'/>
                    <h1 className='nav--brand-title'>Robertify</h1>
                </div>
                <div className='nav--items'>
                    <ul>
                        <li><a href="#">Commands</a></li>
                        <li><a href="#">Vote</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                
            </nav>
            <div className='hero'>
                <h1 className='hero--title'>Robertify</h1>
                <h3 className='hero--subtitle'>A discord music bot with a multitude of features that will fit your liking!</h3>
                <button className='hero--button'>Learn More</button>
            </div>
            <div className='mainContent'>
                <div className='aboutUs'>
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
                        <p className='features--desc-body'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus quam sed finibus tincidunt. Praesent sit amet turpis maximus, dignissim lorem in, maximus felis. Etiam placerat convallis lorem, a mollis elit ornare eu. Suspendisse dolor ex, hendrerit eu quam ut, blandit mollis neque. Aenean ipsum sem, aliquam et nisi sit amet, lacinia tincidunt lectus. Aliquam porta sed lectus feugiat lacinia. Suspendisse euismod bibendum pretium. v</p>
                        <ul>
                            <li>Feature 1</li>
                            <li>Feature 2</li>
                            <li>Feature 3</li>
                            <li>Feature 4</li>
                            <li>Feature 5</li>
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
            <footer>
                <img className='footer--logo' src='https://i.robertify.me/images/0bspn.png' alt='Footer Logo' />
                <h1 className='footer--logo-text'>Robertify</h1>
                <p className='footer--copyright'>Copyright ©️ Robertify 2022</p>
            </footer>
        </main>
    )
}