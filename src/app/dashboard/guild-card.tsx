'use client';

import Card from "@/components/card";
import {Avatar, Badge} from "@nextui-org/react";
import {useMemo} from "react";

type Props = {
    id: string,
    icon?: string,
    name: string,
    isOwner?: boolean,
    isAdmin?: boolean,
}

export default function GuildCard(props: Props) {
    const card = useMemo(() => (
        <Card
            centered
            size='xs'
            hoverable
            className={`pointer-cursor h-32 p-6 hover:!border-primary border-1 flex justify-between phone:!w-full bg-neutral-200 dark:!bg-dark`}
            href={`/dashboard/${props.id}/general`}
        >
            <h3 className='text-neutral-800 dark:text-primary text-xl font-semibold w-1/2 self-center whitespace-nowrap overflow-hidden overflow-ellipsis'>{props.name}</h3>
            <Avatar
                src={props.icon || 'https://i.imgur.com/k14Qfh5.png'}
                className="w-16 h-16"
                isBordered
            />
        </Card>
    ), [props.icon, props.id, props.name])

    return props.isOwner || props.isAdmin ?
        <Badge
            color={props.isOwner ? 'warning' : 'primary'}
            content={props.isOwner ? 'Owner' : 'Admin'}
            variant="shadow"
            className='text-white px-2 uppercase font-semibold border-0'
            classNames={{
                base: "phone:!w-full"
            }}
        >
            {card}
        </Badge> :
        card
}