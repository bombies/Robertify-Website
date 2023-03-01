import FooterGroup from "@/app/_components/footer/footer-group";
import Link from "next/link";
import HyperLink from "@/components/hyperlink";
import Image from "next/image";

export default function Footer() {
    return (
        <div className='bg-neutral-200 dark:bg-neutral-900 p-24 tablet:p-16 flex justify-between gap-4'>
            <div>
                <div className='relative w-16 h-16 mb-6'>
                    <Image src='https://i.imgur.com/fwG8qA5.png' alt='' fill={true} className='dark:drop-shadow-glow-primary-lg' />
                </div>
                <p className='text-neutral-400 dark:text-neutral-500 max-w-xs font-light text-sm'>A discord music bot that with a multitude of features that will fit your liking.</p>
            </div>
            <div className='flex gap-16 phone:gap-4'>
                <FooterGroup heading='Robertify'>
                    <HyperLink href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK || ''}>Invite</HyperLink>
                    <HyperLink href={'/support'}>Support Server</HyperLink>
                </FooterGroup>
                <FooterGroup heading='Resources'>
                    <HyperLink href='/tos'>Terms of Service</HyperLink>
                    <HyperLink href='/privacy'>Privacy Policy</HyperLink>
                    <HyperLink href='https://github.com/bombies/Robertify-Bot'>GitHub</HyperLink>
                </FooterGroup>
            </div>

        </div>
    )
}