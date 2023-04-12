'use client';

import login from "../../../../public/login.svg";
import {ClientSafeProvider, signIn} from "next-auth/react";
import Button from "@/components/button/Button";
import {redirect} from "next/navigation";

const LoginButton = () => {
    return (
        <Button
            className='self-center mx-auto'
            width={8}
            height={3}
            label='Login'
            icon={login}
            onClick={() =>
                signIn('discord', {
                    callbackUrl: '/',
                })
            }
        />
    );
}

export default LoginButton