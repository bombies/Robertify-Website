'use client';

import DashboardContainer from "@/app/dashboard/[id]/(categories)/dashboard-container";
import {useDashboardState} from "@/app/dashboard/[id]/(categories)/dashboard-state-context";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import DashboardSection from "@/app/dashboard/[id]/(categories)/dashboard-section";
import DashboardMiscHandler from "@/app/dashboard/[id]/(categories)/misc/dashboard-misc-handler";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";

export default function DashboardMiscContext() {
    const {
        dashboardInfo,
        session,
        useCurrentData,
        useChangesMade,
        canInteract: stateCanInteract
    } = useDashboardState();
    const router = useRouter();
    const [currentData, setCurrentData] = useCurrentData
    const [, setChangesMade] = useChangesMade;
    const [, startTransition] = useTransition();
    const handler = new DashboardMiscHandler({
        robertifyGuild: currentData,
        discordGuild: dashboardInfo.discordGuild,
        guildChannels: dashboardInfo.discordGuildChannels,
        setCurrentData,
        canInteract: stateCanInteract
    });

    return (
        <div>
            <DashboardContainer>
                <DashboardSection title='8 Ball'>
                    <div className='w-3/4 mb-6'>
                        {handler.generateEightBallTable()}
                    </div>
                    <Button label='Add Response' type={ButtonType.CTA} width={8} />
                </DashboardSection>
            </DashboardContainer>
        </div>
    )
}