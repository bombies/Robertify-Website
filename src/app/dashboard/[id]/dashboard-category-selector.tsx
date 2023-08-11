'use client';

import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Button from "@/components/button/Button";
import {usePathname} from "next/navigation";
import {ButtonType} from "@/components/button/ButtonType";
import DashboardRefreshButton from "@/app/dashboard/[id]/(categories)/dashboard-refresh-button";
import {useGuildDashboard} from "@/app/dashboard/[id]/dashboard-context-wrapper";
import {Badge} from "@nextui-org/react";

type Category = 'general' | 'misc';

type Props = {
    refresh: () => void,
    isRefreshing: boolean,
    canInteract: boolean
}

export default function DashboardCategorySelector(props: Props) {
    const [ selected, setSelected ] = useState<Category>('general');
    const [ dashboardInfo, setDashboardInfo ] = useGuildDashboard();
    const pathName = usePathname();

    useEffect(() => {
        if (!pathName)
            return;
        if (pathName.includes('general'))
            setSelected('general')
        else if (pathName.includes('misc'))
            setSelected('misc')
    }, [pathName])

    const id = dashboardInfo.id;

    return (
        <div className='flex gap-4 m-6 phone:mx-2 tablet:justify-center'>
            <DashboardRefreshButton
                refresh={props.refresh}
                isRefreshing={props.isRefreshing}
                canInteract={props.canInteract}
            />
            <Selector
                id={id}
                category={'general'}
                selected={selected}
                setSelected={setSelected}
            />
            <Badge
                color='warning'
                variant="shadow"
                className="text-white border-0 px-2 font-semibold"
                content="NEW!"
            >
                <Selector
                    id={id}
                    category={'misc'}
                    selected={selected}
                    setSelected={setSelected}
                />
            </Badge>
        </div>
    )
}

type SelectorProps = {
    id?: string,
    category: Category,
    selected: Category,
    setSelected: Dispatch<SetStateAction<Category>>
}

function Selector(props: SelectorProps) {
    return (
        <Button
            label={`${props.category.charAt(0).toUpperCase()}${props.category.substr(1)}`}
            width={10}
            height={3}
            newTab={false}
            href={`/dashboard/${props.id}/${props.category}`}
            hrefClick={() => props.setSelected(props.category)}
            type={props.selected === props.category ? ButtonType.PRIMARY : ButtonType.GREY}
        />
    )
}