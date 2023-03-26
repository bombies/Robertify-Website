'use client';

import {useEffect} from "react";
import Card from "@/components/card";
import {useRouter} from "next/navigation";
import Button from "@/components/button/Button";
import refreshIcon from '/public/refresh.svg';
import {ButtonType} from "@/components/button/ButtonType";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error,
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error)
    }, [error, router]);

    return (
        <main className='min-h-screen p-24'>
            <Card centered size='md' title='Oh no!' description='There was an error loading your servers!'>
                <div className='my-6 w-3/4 bg-danger text-white p-6 rounded-xl'>
                    <p>
                        {error.message}
                    </p>
                </div>
                <Button label='Refresh' type={ButtonType.DANGER} width={8} height={3} icon={refreshIcon} onClick={reset} />
            </Card>
        </main>
    )
}