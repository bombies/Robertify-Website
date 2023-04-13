'use client';

import {useGuildDashboard} from '@/app/dashboard/[id]/dashboard-context-wrapper';
import {useRouter} from 'next/navigation';
import {useTransition} from 'react';
import {useSession} from 'next-auth/react';
import DashboardContainer from '@/app/dashboard/[id]/(categories)/dashboard-container';
import DashboardPermissionsHandler from '@/app/dashboard/[id]/(categories)/permissions/dashboard-permissions-handler';

export default function DashboardPermissionsContext() {
    const [dashboardInfo, setDashboardInfo] = useGuildDashboard();
    const {value: discordGuild, loading: discordGuildLoading} = dashboardInfo.discordGuild;
    const {value: robertifyGuild, loading: robertifyGuildLoading} = dashboardInfo.robertifyGuild;
    const {value: discordGuildChannels, loading: discordGuildChannelsLoading} = dashboardInfo.discordGuildChannels;
    const router = useRouter();
    const {currentData, canInteract: stateCanInteract} = dashboardInfo
    const [, startTransition] = useTransition();
    const session = useSession().data;

    const handler = new DashboardPermissionsHandler({
        canInteract: stateCanInteract ?? false,
        guildChannels: discordGuildChannels,
        robertifyGuild,
        discordGuild,
        setDashboardState: setDashboardInfo
    });

    return (
        <DashboardContainer>
            {handler.generateTableForRolePermissions()}
        </DashboardContainer>
    )
}