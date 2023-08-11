'use client';

import {useMemo} from "react";
import LogoutButton from "@/app/_components/nav/logout-button";
import {useSession} from "next-auth/react";
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Spacer
} from "@nextui-org/react";
import ServersIcon from "@/app/_components/icons/ServersIcon";
import {useRouter} from "next/navigation";

export default function NavUserProfile() {
    const discordInfo = useSession().data?.user;
    const router = useRouter()
    const avatar = useMemo(() => discordInfo && discordInfo.avatar ? `https://cdn.discordapp.com/avatars/${discordInfo.id}/${discordInfo.avatar}.${discordInfo.avatar.startsWith('a_') ? 'gif' : 'webp'}?size=512` : 'https://i.imgur.com/vVJ4UgG.png', [discordInfo]);

    return (
        <Dropdown
            className="phone:w-64 w-96"
            classNames={{
                base: "bg-neutral-100/70 dark:bg-black/70 backdrop-blur-md border-1 dark:border-white/20 border-black/20",
            }}
        >
            <DropdownTrigger>
                <Avatar
                    isBordered
                    color="success"
                    src={avatar}
                    size="sm"
                    as="button"
                    className="tablet:m-3"
                />
                {/*<User*/}
                {/*    as="button"*/}
                {/*    name={discordInfo?.username || "Unknown User"}*/}
                {/*    avatarProps={{*/}
                {/*        isBordered: true,*/}
                {/*        color: "success",*/}
                {/*        src: avatar,*/}
                {/*        size: "sm",*/}
                {/*    }}*/}
                {/*    className="self-center"*/}
                {/*    classNames={{*/}
                {/*        name: "text-primary",*/}
                {/*        base: "gap-4"*/}
                {/*    }}*/}
                {/*>*/}
                {/*</User>*/}
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User Profile Dropdown"
                itemClasses={{
                    base: `
                                data-[hover=true]:bg-primary/20
                                py-4
                            `
                }}
                onAction={key => {
                    switch (key) {
                        case "servers": {
                            router.push("/dashboard")
                            break;
                        }
                    }
                }}
            >
                <DropdownSection showDivider>
                    <DropdownItem
                        isReadOnly
                        key="user_avatar"
                    >
                        <div className="p-6 flex">
                            <Avatar
                                isBordered
                                color="success"
                                src={avatar}
                                className="w-16 h-16"
                            />
                            <Spacer x={6}/>
                            <div className="self-center">
                                <p className="text-primary text-xl font-semibold">@{discordInfo?.username}</p>
                                <p className="text-neutral-500 dark:text-neutral-200 text-sm font-light">The coolest
                                    discord user.</p>
                            </div>
                        </div>
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection showDivider>
                    <DropdownItem
                        key="servers"
                        startContent={<ServersIcon width={26} fill={"#00D615"}/>}
                        description="Jump to your dashboard and configure Robertify for your servers."
                    >
                        Your Servers
                    </DropdownItem>
                </DropdownSection>
                <DropdownItem key="logout_button" isReadOnly>
                    <LogoutButton/>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        // <div ref={wrapperRef} className='mx-auto'>
        //     <div className=''>
        //         <div
        //             className='flex gap-4 cursor-pointer transition-faster'
        //             onClick={toggleExpanded}
        //         >
        //             <GenericImage
        //                 src={avatar}
        //                 alt='Discord User Avatar'
        //                 width={2}
        //                 imageClassName='self-center rounded-full'
        //             />
        //             <p className='self-center text-primary font-semibold drop-shadow-glow-primary-lg'>{discordInfo?.username}</p>
        //         </div>
        //         <div
        //             ref={miniViewRef}
        //             className='absolute dark:bg-dark/80 right-0 mt-4 mr-2 z-50 w-56 p-6 h-fit bg-neutral-100/80 backdrop-blur-md rounded-xl transition-faster border-[1px] border-primary'
        //             style={{
        //                 display: expanded ? 'inherit' : 'none'
        //             }}
        //         >
        //             {
        //                 discordInfo &&
        //                 <div>
        //                     <GenericImage
        //                         className='mb-4 self-center border-2 border-primary rounded-full shadow-lg  shadow-primary/0 mx-auto'
        //                         imageClassName='rounded-full'
        //                         src={avatar}
        //                         width={6}
        //                     />
        //                     <p className='self-center text-primary text-center text-xl drop-shadow-glow-primary-lg font-semibold pointer-events-none mb-6'>{discordInfo?.username}</p>
        //                 </div>
        //             }
        //             <div className='space-y-3'>
        //                 <div className='flex gap-1'>
        //                     <BadgeWrapper
        //                         color='warning'
        //                         content='BETA'
        //                     >
        //                         <Button
        //                             centered
        //                             width={10}
        //                             height={2.5}
        //                             icon={serverIcon}
        //                             label='Servers'
        //                             href='/dashboard'
        //                             newTab={false}
        //                             type={ButtonType.PRIMARY}
        //                         />
        //                     </BadgeWrapper>
        //                 </div>
        //                 <LogoutButton/>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}