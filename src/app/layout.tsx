import './globals.scss'
import React from "react";
import NavbarContainer from "@/app/_components/nav/navbar-container";
import Footer from "@/app/_components/footer/footer";
import Providers from "@/app/_components/providers";
import storeWrapper from "@/utils/redux/redux-store";

export const metadata = {
    title: 'Robertify',
    description: 'A next-gen music bot',
}

type Props = React.PropsWithChildren;

export default function RootLayout(props: Props) {
    return (
        <html lang="en">
        <Providers>
            {/* @ts-expect-error Async Server Component */}
            <NavbarContainer/>
            {props.children}
            <Footer/>
        </Providers>
        </html>
    )
}
