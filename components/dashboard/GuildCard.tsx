import Link from 'next/link';
import {Tooltip} from "flowbite-react";
import Image from "next/image";

export default function GuildCard({ guildID, guildIcon = null, guildName, isOwner = false,  guildPermissions = 0 }) {
    const icon: string = guildIcon ? `https://cdn.discordapp.com/icons/${guildID}/${guildIcon}.${guildIcon.startsWith('a_') ? 'gif' : 'webp'}?size=512` : `${process.env.NEXT_PUBLIC_HOSTED_IMAGE_SERVER_HOSTNAME}/images/rykx6.png`;

    // Bitwise operations to check if the user has MANAGE_GUILD
    let isModerator: boolean = isOwner ? false : (guildPermissions & (1 << 5)) === (1 << 5);

    // If the user doesn't have MANAGE_GUILD check if they have ADMINISTRATOR
    isModerator ||= (guildPermissions & (1 << 3)) == (1 << 3);

    // When guildPermission is 0 it caused the value to be incorrectly true.
    // This corrects that
    isModerator = !guildPermissions ? false : isModerator;

    return (
        <div className="flex phone:flex-col overflow-hidden w-full h-40 bg-neutral-800 rounded-3xl border-0 hover:border-[2px] border-white/[.103] drop-shadow-lg transition-all duration-[50ms] ease-in-out">
            <div className='w-full phone:h-1/2'>
                { isOwner === true ?
                    <div className='flex gap-x-2 z-10 absolute left-4 top-3'>
                        <Tooltip content='Server Owner' trigger='hover' style='dark' placement='right'>
                            <div className='w-4 h-4 self-center relative'>
                                <Image src={`${process.env.NEXT_PUBLIC_HOSTED_IMAGE_SERVER_HOSTNAME}/images/gmqf5.png`} fill={true} alt='Server Owner' />
                            </div>
                        </Tooltip>
                    </div>
                    : isModerator && 
                        <div className='flex gap-x-2 z-10 absolute left-4 top-3'>
                            <Tooltip content='Server Administrator' trigger='hover' style='dark' placement='right'>
                                <div className='w-4 h-4 self-center relative'>
                                    <Image src={`${process.env.NEXT_PUBLIC_HOSTED_IMAGE_SERVER_HOSTNAME}/images/bhg1n.png`} fill={true} alt='Server Administrator' />
                                </div>
                            </Tooltip>
                        </div>
                }
                <div className='shadow-[0_4px_10px_rgba(0,0,0,0.35)] w-full h-full object-cover z-0 relative'>
                    <Image src={icon} fill={true} alt={`${guildName} Guild Icon`} className='object-cover' />
                </div>
            </div>
            <div className='guildCard--text'>
                <h2 className='guildCard--name'>{guildName}</h2>
                <Link href={`/dashboard/guilds/${guildID}`}><span className='text-white bg-lime-600 transition-all duration-200 ease-in-out hover:scale-105 w-1/2 mx-auto rounded-lg px-3 py-2 mt-2 cursor-pointer phone:py-1 phone:w-2/5'>Configure</span></Link>
            </div>
        </div>
    )
}