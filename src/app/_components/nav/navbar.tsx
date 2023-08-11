'use client';

import Link from "next/link";
import {useSession} from "next-auth/react";
import LoginButton from "@/app/_components/nav/login-button";
import GenericImage from "@/app/_components/GenericImage";
import {
    Button,
    Dropdown, DropdownItem, DropdownMenu, DropdownSection,
    DropdownTrigger,
    Navbar as NextNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@nextui-org/react";
import HyperLink from "@/components/hyperlink";
import NavUserProfile from "@/app/_components/nav/nav-user-profile";
import DarkModeSwitcher from "@/app/_components/nav/dark-mode-switcher";
import HamburgerIcon from "@/app/_components/icons/HamburgerIcon";
import {useTheme} from "next-themes";
import EnterIcon from "@/app/_components/icons/EnterIcon";
import SlashIcon from "@/app/_components/icons/SlashIcon";
import HelpIcon from "@/app/_components/icons/HelpIcon";
import SparkleIcon from "@/app/_components/icons/SparkleIcon";
import {useRouter} from "next/navigation";

export default function Navbar() {
    const discordInfo = useSession().data?.user;
    const router = useRouter()
    const {theme} = useTheme()

    return (
        <NextNavbar
            shouldHideOnScroll
            classNames={{
                base: `dark:bg-black/70 dark:text-white py-3`
            }}
        >
            <NavbarBrand>
                <Link href='/' className={'flex gap-4 justify-center cursor-pointer hover:scale-105 transition-fast'}>
                    <GenericImage
                        className='self-center'
                        src='https://i.imgur.com/fwG8qA5.png'
                        alt='Robertify Logo'
                        width={2}
                    />
                    <h1 className='uppercase font-black text-2xl self-center tracking-widest text-primary my-auto'>Robertify</h1>
                </Link>
            </NavbarBrand>
            <NavbarContent className="gap-12 tablet:hidden" justify="center">
                <NavbarItem>
                    <HyperLink href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK || ''}>INVITE</HyperLink>
                </NavbarItem>
                <NavbarItem>
                    <HyperLink href='/commands' newTab={false}>COMMANDS</HyperLink>
                </NavbarItem>
                <NavbarItem>
                    <HyperLink href='/vote' newTab={false}>VOTE</HyperLink>
                </NavbarItem>
                <NavbarItem>
                    <HyperLink href='/docs' newTab={false}>SUPPORT</HyperLink>
                </NavbarItem>
                <NavbarItem>
                    {
                        !discordInfo ?
                            <LoginButton/>
                            :
                            <NavUserProfile/>
                    }
                </NavbarItem>
                <NavbarItem>
                    <DarkModeSwitcher/>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent className="hidden tablet:flex" justify="center">
                <Dropdown
                    className="phone:w-64 w-96"
                    classNames={{
                        base: "bg-neutral-100/70 dark:bg-black/70 backdrop-blur-md border-1 dark:border-white/20 border-black/20",
                    }}
                >
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                isIconOnly
                                variant="light"
                                startContent={<HamburgerIcon fill={theme === "dark" ? "#fff" : "#000"}/>}
                            />
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="Mobile Navigation Dropdown"
                        itemClasses={{
                            base: `
                                data-[hover=true]:bg-primary/20
                                py-4
                            `
                        }}
                        onAction={key => {
                            switch (key) {
                                case "invite": {
                                    router.push(process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK || '')
                                    break;
                                }
                                case "commands": {
                                    router.push("/commands")
                                    break;
                                }
                                case "support": {
                                    router.push("/docs")
                                    break;
                                }
                                case "vote": {
                                    router.push("/vote")
                                    break;
                                }
                            }
                        }}
                    >
                        <DropdownSection showDivider>
                            <DropdownItem key="user_controls" isReadOnly>
                                {
                                    !discordInfo ?
                                        <LoginButton/>
                                        :
                                        <NavUserProfile/>
                                }
                            </DropdownItem>
                        </DropdownSection>
                        <DropdownSection showDivider>
                            <DropdownItem
                                key="invite"
                                startContent={<EnterIcon width={20} fill={"#00D615"}/>}
                                description="Invite Robertify to your Discord server!"
                            >
                                Invite Robertify
                            </DropdownItem>
                            <DropdownItem
                                key="commands"
                                startContent={<SlashIcon width={20} fill={"#00D615"}/>}
                                description="View all the commands Robertify has to offer"
                            >
                                Commands
                            </DropdownItem>
                            <DropdownItem
                                key="support"
                                startContent={<HelpIcon width={20} fill={"#00D615"}/>}
                                description="Need help? Follow the official Robertify guide and walkthrough."
                            >
                                Support
                            </DropdownItem>
                            <DropdownItem
                                key="vote"
                                startContent={<SparkleIcon width={20} fill={"#00D615"}/>}
                                description="Show your support for Robertify by voting for us."
                            >
                                Vote
                            </DropdownItem>
                        </DropdownSection>
                        <DropdownItem
                            isReadOnly
                            key="dark_switch"
                        >
                            <DarkModeSwitcher/>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </NextNavbar>
    )
}