'use client';

import {signIn, useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default async function LoginPage() {
    const session = useSession();

    if (session.status === 'authenticated')
        redirect('/');

    signIn('discord', {
        callbackUrl: '/'
    });

    return (
        <main></main>
    )
}

