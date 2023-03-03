'use client';

import {useRouter} from "next/navigation";
import {useTransition} from "react";
import Button from "@/components/button/Button";

export function RefreshJoke() {
    const router = useRouter();
    const [ isPending, startTransition ] = useTransition();
    const refreshJoke = async () => {
        startTransition(() => {
            router.refresh();
        })
    }

    return (
        <Button
            onClick={refreshJoke}
            disabled={isPending}
            isWorking={isPending}
            width={10}
            height={3}
            label='Refresh Joke'
        />
    )
}