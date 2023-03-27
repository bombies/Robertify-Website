'use client';

import {useEffect, useState} from "react";
import Button from "@/components/button/Button";
import {usePathname, useRouter} from "next/navigation";
import {useGuildDashboard} from "@/app/dashboard/[id]/guild-info-context";
import {ButtonType} from "@/components/button/ButtonType";

type Category = 'general' | 'misc';

export default function DashboardCategorySelector() {
    const [ selected, setSelected ] = useState<Category>('general');
    const [ dashboardInfo, ] = useGuildDashboard();
    const pathName = usePathname();

    useEffect(() => {
        if (!pathName)
            return;
        if (pathName.includes('general'))
            setSelected('general')
        else if (pathName.includes('misc'))
            setSelected('misc')
    }, [pathName])

    return (
        <div className='flex gap-4 m-6 tablet:justify-center'>
            <Button
                label='General'
                width={10}
                height={3}
                newTab={false}
                href={`/dashboard/${dashboardInfo.robertifyGuild?.server_id}/general`}
                hrefClick={() => setSelected('general')}
                type={selected === 'general' ? ButtonType.PRIMARY : ButtonType.GREY}
            />
            <Button
                label='Miscellaneous'
                width={10}
                height={3}
                newTab={false}
                href={`/dashboard/${dashboardInfo.robertifyGuild?.server_id}/misc`}
                hrefClick={() => setSelected('misc')}
                type={selected === 'misc' ? ButtonType.PRIMARY : ButtonType.GREY}
            />
        </div>
    )
}