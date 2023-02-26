'use client';

import {useRouter} from "next/navigation";
import {useTransition} from "react";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

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
            width={10}
            height={3}
        >
            {isPending && (
                <Spinner size={1}/>
            )}
            Refresh Joke
        </Button>
    )
}