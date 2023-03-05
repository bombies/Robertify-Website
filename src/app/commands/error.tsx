'use client';

import {useEffect} from "react";
import HeadingSection from "@/components/heading-section";
import Card from "@/components/card";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import refresh from '/public/refresh.svg';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error,
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error)
    });

    return (
        <main>
            <HeadingSection heading='Commands' subheading='So... many... commands...' />
            <div className='py-12 px-24 tablet:px-12 phone:px-4'>
                <Card className='mx-auto' size='md' hoverable>
                    <div className='mx-auto'>
                        <h1>Oh no!</h1>
                        <p>There was an error loading commands. :(</p>
                        <Button type={ButtonType.DANGER} label='Refresh' icon={refresh} onClick={reset} />
                    </div>
                </Card>
            </div>
        </main>
    )
}