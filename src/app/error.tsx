'use client';

import {useEffect} from "react";

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
        <div>
            <p>
                Something went terribly wrong....
            </p>
            <code>
                {error.message}
            </code>
        </div>
    )
}