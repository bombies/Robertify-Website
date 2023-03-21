'use client';

import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {useDiscordData} from "@/app/_components/discord-data-context";
import jsCookie from "js-cookie";
import Button from "@/components/button/Button";
import logoutIcon from '/public/logout.svg';
import {ButtonType} from "@/components/button/ButtonType";

export default function LogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [, setDiscordData] = useDiscordData();

    const logout = async () => {
        setDiscordData(null);
        jsCookie.remove("login-token");

        startTransition(() => {
            router.refresh();
        })
    }

    return (
        <div className='flex justify-center'>
            <Button
                width={6}
                height={2.5}
                className='text-center pointer-events-auto'
                onClick={logout}
                disabled={isPending}
                isWorking={isPending}
                label='Logout'
                icon={logoutIcon}
                type={ButtonType.DANGER}
            />
        </div>
    )
}