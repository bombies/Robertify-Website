'use client';

import {ClientSafeProvider, getProviders, signIn, useSession} from "next-auth/react";
import {redirect} from "next/navigation";

type Props = {
    providers: ClientSafeProvider[]
}

export default function LoginContext(props: Props) {
    const session = useSession();

    if (session.status === 'authenticated')
        redirect('/');
    const provider = props.providers[0]

    signIn(provider.id, {
        callbackUrl: '/'
    });

    return (
        <main></main>
    )
}