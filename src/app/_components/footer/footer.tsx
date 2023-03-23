import FooterGroup from "@/app/_components/footer/footer-group";
import Link from "next/link";
import HyperLink from "@/components/hyperlink";
import Image from "next/image";

export default function Footer() {
    return (
        <div className='bg-neutral-200 dark:bg-dark/50 p-24 tablet:p-16 phone:p-3 flex phone:flex-col justify-between gap-4'>
            <div>
                <div className='relative w-16 h-16 mb-6 phone:mb-2'>
                    <Image
                        draggable={false}
                        src='https://i.imgur.com/fwG8qA5.png'
                        alt=''
                        fill={true}
                        className='dark:drop-shadow-glow-primary-lg'
                        sizes='4rem'
                    />
                </div>
                <p className='text-neutral-400 dark:text-neutral-500 max-w-xs phone:max-w-3/4 font-light text-sm phone:text-[.75rem]'>A discord music bot that with a multitude of features that will fit your liking.</p>
            </div>
            <div className='flex gap-16 phone:gap-4 phone:justify-center'>
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