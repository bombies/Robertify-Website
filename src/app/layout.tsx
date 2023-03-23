import './globals.scss'
import React from "react";
import Footer from "@/app/_components/footer/footer";
import Providers from "@/app/_components/providers";
import ProgressBar from "@/app/_components/progress-bar";
import glow from "/public/rob-web-glow.png";
import NavBar from "@/app/_components/nav/navbar";
import {Inter} from "next/font/google";
import GenericImage from "@/app/_components/GenericImage";

export const metadata = {
    title: 'Robertify',
    description: 'A next-gen music bot',
}

interface Props extends React.PropsWithChildren {
    session: any
}

const inter = Inter({
    subsets: ['latin'],
})

export default function RootLayout(props: Props) {
    return (
        <html suppressHydrationWarning lang="en" className={inter.className}>
        <Providers session={props.session}>
            <ProgressBar/>
            <GenericImage
                priority
                className='dark:visible opacity-50 blur-xl invisible !fixed w-screen h-screen z-[0]'
                imageClassName='blur-xl z-[0]'
                src={glow}
            />
            <div className={'!z-[1] relative'}>
                <NavBar/>
                {props.children}
                <Footer/>
            </div>
        </Providers>
        </html>

    )
}
