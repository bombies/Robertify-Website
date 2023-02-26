import './globals.scss'
import NavBar from './_components/navbar'
import {DiscordDataProvider} from "./_components/discord-data-context";

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
        <body>
        <DiscordDataProvider initialDiscordData={undefined}>
            <NavBar/>
            {children}
        </DiscordDataProvider>
        </body>
        </html>
    )
}
