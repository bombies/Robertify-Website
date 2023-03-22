import './globals.scss'
import React from "react";
import Footer from "@/app/_components/footer/footer";
import Providers from "@/app/_components/providers";
import ProgressBar from "@/app/_components/progress-bar";
import Image from "next/image";
import glow from "/public/rob-web-glow.png";
import NavBar from "@/app/_components/nav/navbar";
import {Inter} from 'next/font/google';

export const metadata = {
    title: 'Robertify',
    description: 'A next-gen music bot',
}

interface Props extends React.PropsWithChildren {
    session: any
}


const inter = Inter({subsets: ['latin']});

export default function RootLayout(props: Props) {
    return (
        <html suppressHydrationWarning lang="en">
        <Providers session={props.session}>
            <ProgressBar/>
            <div className='dark:visible opacity-50 blur-xl invisible fixed w-full h-full z-[0]'>
                <Image
                    draggable={false}
                    className='blur-xl z-[0]'
                    src={glow}
                    alt=''
                    fill={true}
                    sizes='100vw, 100vh'
                />
            </div>
            <div className={'!z-[1] relative tracking-wide !' + inter.className}>
                <NavBar/>
                {props.children}
                <Footer/>
            </div>
        </Providers>
        </html>

    )
}
