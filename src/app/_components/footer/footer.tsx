import FooterGroup from "@/app/_components/footer/footer-group";
import HyperLink from "@/components/hyperlink";
import GenericImage from "@/app/_components/GenericImage";

const Footer = () => {
    return (
        <div
            className='bg-neutral-200 dark:bg-dark/50 p-24 tablet:p-16 phone:p-3 flex phone:flex-col justify-between gap-4'>
            <div>
                <GenericImage
                    className='mb-6 phone:mb-2'
                    src='https://i.imgur.com/fwG8qA5.png'
                    width={4}
                />
                <p className='text-neutral-400 dark:text-neutral-500 max-w-xs phone:max-w-3/4 font-light text-sm phone:text-[.75rem]'>A
                    discord music bot that with a multitude of features that will fit your liking.</p>
            </div>
            <div className='flex gap-16 phone:gap-4 phone:justify-center'>
                <FooterGroup heading='Robertify'>
                    <HyperLink href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK || ''}>Invite</HyperLink>
                    <HyperLink href={'/docs'} newTab={false}>Documentation</HyperLink>
                    <HyperLink href={'/support-server'} newTab={false}>Support Server</HyperLink>
                </FooterGroup>
                <FooterGroup heading='Resources'>
                    <HyperLink href='/tos' newTab={false}>Terms of Service</HyperLink>
                    <HyperLink href='/privacy' newTab={false}>Privacy Policy</HyperLink>
                    <HyperLink href='https://github.com/bombies/Robertify-Bot'>GitHub</HyperLink>
                </FooterGroup>
            </div>
        </div>
    )
}

export default Footer