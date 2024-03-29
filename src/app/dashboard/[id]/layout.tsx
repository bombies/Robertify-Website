import React from "react";
import {getServerSession, Session} from "next-auth";
import {AxiosError} from "axios";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {
    fetchDiscordGuildInfo
} from "@/utils/api/api-methods";
import DashboardContextWrapper from "@/app/dashboard/[id]/dashboard-context-wrapper";

interface Props extends React.PropsWithChildren {
    params: { id: string }
}

const getDiscordGuildInfo = async (id: string, session: Session | null) => {
    try {
        return await fetchDiscordGuildInfo(id, session?.user);
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 404 || e.response?.status === 403)
                return undefined;
        }
    }

}

export async function generateMetadata({params}: { params: { id: string } }) {
    const {id} = params;
    let guildInfo = await getDiscordGuildInfo(id, await getServerSession(authOptions));
    // @ts-ignore
    if (guildInfo?.code === 10004)
        guildInfo = undefined;

    return {
        title: `Robertify - ${!guildInfo ? 'No Server' : guildInfo?.name}`
    }
}

export default async function GuildDashboardLayout({children, params}: Props) {
    return (
        <DashboardContextWrapper id={params.id}>
            {children}
        </DashboardContextWrapper>

    )
}