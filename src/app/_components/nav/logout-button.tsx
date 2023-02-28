'use client';

import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {useDiscordData} from "@/app/_components/discord-data-context";
import jsCookie from "js-cookie";
import Button from "@/components/button/Button";

export default function LogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [, setDiscordData] = useDiscordData();

    const logout = async () => {
        setDiscordData(null);
        jsCookie.set("login-token", "");

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
            >
                Logout
            </Button>
        </div>
    )
}