'use client';

import {useEffect} from "react";

const Error = ({error, reset}: { error: Error, reset: () => void }) => {
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

export default Error