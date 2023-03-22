'use client';

import Button from "@/components/button/Button";
import logoutIcon from '/public/logout.svg';
import {ButtonType} from "@/components/button/ButtonType";
import {signOut} from "next-auth/react";

export default function LogoutButton() {
    return (
        <div className='flex justify-center'>
            <Button
                width={6}
                height={2.5}
                className='text-center pointer-events-auto'
                onClick={() => signOut({
                    callbackUrl: '/'
                })}
                label='Logout'
                icon={logoutIcon}
                type={ButtonType.DANGER}
            />
        </div>
    )
}