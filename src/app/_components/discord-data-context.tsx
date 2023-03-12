'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export type DiscordInfo = {
    id: string,
    username: string,
    bot?: boolean,
    system?: boolean,
    mfa_enabled?: boolean,
    banner?: string | null,
    accent_color?: number | null,
    locale?: string,
    verified?: boolean,
    email?: string | null,
    flags?: number,
    premium_type?: number,
    avatar: string,
    avatar_decoration: string | null
    discriminator: string,
    public_flags?: number,
}

const DiscordDataContext = React.createContext<[DiscordInfo | undefined, React.Dispatch<React.SetStateAction<null | DiscordInfo>>] | undefined>(undefined);

export function DiscordDataProvider({
                                    children,
                                    initialDiscordData
                                }: {
    children: React.ReactNode,
    initialDiscordData?: DiscordInfo
}) {
    const [ discordData, setDiscordData ] = useState<null | DiscordInfo>(null);
    const data = discordData || initialDiscordData;

    return (
        <DiscordDataContext.Provider value={[data, setDiscordData]}>
            {children}
        </DiscordDataContext.Provider>
    )
}

export function useDiscordData() {
    const context = React.useContext(DiscordDataContext);
    if (!context)
        throw new Error('useDiscordData must be used within a DiscordDataProvider');
    return context;
}

export function useDiscordDataRequired() {
    const router = useRouter();
    const [ discordInfo ] = useDiscordData();

    useEffect(() => {
        if (!discordInfo)
            router.push('/')
    }, [discordInfo, router])

    return discordInfo;
}
