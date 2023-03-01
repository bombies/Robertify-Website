import './globals.scss'
import React from "react";
import NavbarContainer from "@/app/_components/nav/navbar-container";
import Footer from "@/app/_components/footer/footer";
import Providers from "@/app/_components/providers";
import ProgressBar from "@/app/_components/progress-bar";

export const metadata = {
    title: 'Robertify',
    description: 'A next-gen music bot',
}

type Props = React.PropsWithChildren;

export default function RootLayout(props: Props) {
    return (
        <html lang="en">
        <Providers>
            <ProgressBar />
            {/* @ts-expect-error Async Server Component */}
            <NavbarContainer/>
            {props.children}
            <Footer/>
        </Providers>
        </html>
    )
}
