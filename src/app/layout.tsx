import './globals.scss'
import NavBar from './_components/navbar'

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
        <NavBar/>
        {children}
        </body>
        </html>
    )
}
