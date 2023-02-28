import './globals.scss'
import React from "react";
import NavbarContainer from "@/app/_components/nav/navbar-container";
import {DiscordDataProvider} from "@/app/_components/discord-data-context";
import {DarkModeProvider} from "@/app/_components/dark-mode-context";

export const metadata = {
    title: 'Robertify',
    description: 'A next-gen music bot',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <DarkModeProvider initialDarkModeState={false}>
            <DiscordDataProvider initialDiscordData={undefined}>
                {/* @ts-expect-error Async Server Component */}
                <NavbarContainer/>
                {children}
            </DiscordDataProvider>
        </DarkModeProvider>
        </html>
    )
}
