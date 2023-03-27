'use client';

import {signIn, useSession} from "next-auth/react";
import {redirect, useSearchParams} from "next/navigation";
import {NextPageContext} from "next";

export default function LoginPage() {
    const session = useSession();
    const searchParams =  useSearchParams();

    if (session.status === 'authenticated' || searchParams?.get("error") === 'Callback')
        redirect('/');

    signIn('discord', {
        callbackUrl: '/'
    });

    return (
        <main>{searchParams?.get("error")}</main>
    )
}