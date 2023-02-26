import './globals.scss'
import Link from "next/link";
import Image from "next/image";

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
        <nav className='flex w-full h-20 overflow-hidden p-6'>
            <div className='flex cursor-pointer hover:scale-105 transition-fast'>
                <div className='relative w-16 h-16 self-center'>
                    <Image src='https://i.imgur.com/fwG8qA5.png' alt='Robertify Logo' fill={true} />
                </div>
                <h1  className='uppercase font-black text-3xl self-center text-primary'>Robertify</h1>
            </div>
            <div className='self-center mx-auto flex gap-16'>
                <Link href='/invite'>INVITE</Link>
                <Link href='/commands'>COMMANDS</Link>
                <Link href='/vote'>VOTE</Link>
                <Link href='/support'>SUPPORT</Link>
            </div>
        </nav>
        {children}
        </body>
        </html>
    )
}
