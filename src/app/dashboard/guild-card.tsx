'use client';

import Card from "@/components/card";
import crownIcon from '/public/crown.svg';
import shieldIcon from '/public/shield.svg';
import {Tooltip} from "@nextui-org/react";
import GenericImage from "@/app/_components/GenericImage";

type Props = {
    id: string,
    icon?: string,
    name: string,
    isOwner?: boolean,
    isAdmin?: boolean,
}

export default function GuildCard(props: Props) {
    return (
        <Card
            centered
            size='xs'
            hoverable
            className={`relative pointer-cursor h-32 !p-0 flex flex-col phone:w-full bg-primary dark:!bg-dark`}
            href={`/dashboard/${props.id}/general`}
        >
            {
                (props.isOwner || props.isAdmin) &&
                <Tooltip
                    className='absolute right-[-10px] top-[-10px] z-10'
                    content={props.isOwner ? 'Server Owner' : 'Server Administrator'}
                    color='primary'
                    placement='topEnd'
                >
                    <GenericImage src={props.isOwner ? crownIcon : shieldIcon} width={1.5} />
                </Tooltip>

            }
            <div
                className='relative rounded-xl w-full h-full dark:bg-dark/90 bg-neutral-200/50 border-2 border-white dark:border-primary/10 hover:border-primary/50 flex justify-between align-middle p-6 transition-fast'
            >
                <h3 className='text-white dark:text-primary text-xl font-semibold w-1/2 self-center whitespace-nowrap overflow-hidden overflow-ellipsis'>{props.name}</h3>
                <GenericImage
                    src={props.icon || 'https://i.imgur.com/k14Qfh5.png'}
                    className='relative w-16 h-16 rounded-full border-2 dark:border-primary border-white'
                    imageClassName='rounded-full'
                    width={4}
                />
            </div>
        </Card>
    )
}