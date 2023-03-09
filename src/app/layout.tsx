import './globals.scss'
import React from "react";
import NavbarContainer from "@/app/_components/nav/navbar-container";
import Footer from "@/app/_components/footer/footer";
import Providers from "@/app/_components/providers";
import ProgressBar from "@/app/_components/progress-bar";
import Image from "next/image";
import glow from "/public/rob-web-glow.png";

export const metadata = {
    title: 'Robertify',
    description: 'A next-gen music bot',
}

type Props = React.PropsWithChildren;

export default function RootLayout(props: Props) {
    return (
        <html suppressHydrationWarning  lang="en">
        <Providers>
            <ProgressBar />
            <div className='dark:visible opacity-50 blur-xl invisible fixed w-full h-full z-[0]'>
                <Image draggable={false} className='blur-xl z-[0]' src={glow} alt='' fill={true} />
            </div>
            <div className='z-[1]'>
                {/* @ts-expect-error Async Server Component */}
                <NavbarContainer/>
                {props.children}
            </div>
            <Footer/>
        </Providers>
        </html>

    )
}
