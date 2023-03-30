'use client';

import DashboardContainer from "@/app/dashboard/[id]/(categories)/dashboard-container";
import {useMemo, useState, useTransition} from "react";
import DashboardMiscHandler from "@/app/dashboard/[id]/(categories)/misc/dashboard-misc-handler";
import {useGuildDashboard} from "@/app/dashboard/[id]/dashboard-context-wrapper";
import {RobertifyGuild} from "@/utils/discord-types";

export default function DashboardMiscContext() {
    const [dashboardInfo, setDashboardInfo] = useGuildDashboard();
    const { currentData, canInteract: stateCanInteract } = dashboardInfo;

    const setChangesMade = (val: boolean) => setDashboardInfo(prev => ({
        ...prev,
        changesMade: val
    }));

    const [addEightBallResponse, setAddEightBallResponse] = useState(false);
    const [proposedResponse, setProposedResponse] = useState('');
    const toggleEightBallModal = () => {
        setAddEightBallResponse(prev => !prev);
    }

    const eightBallValidator = useMemo((): { text: string, color: 'primary' | 'error' | 'success' } => {
        if (!proposedResponse)
            return {
                text: "",
                color: "primary"
            };
        const isValid = proposedResponse.length <= 3500;
        return {
            text: isValid ? 'Cool response!' : 'Your response must not be over 3500 characters.',
            color: isValid ? 'success' : 'error',
        };
    }, [proposedResponse])

    const handler = new DashboardMiscHandler({
            toggleEightBallModal,
            addEightBallResponse,
            setAddEightBallResponse,
            proposedResponse,
            setProposedResponse,
            eightBallValidator
        },
        {
            robertifyGuild: currentData,
            discordGuild: dashboardInfo.discordGuild.value,
            guildChannels: dashboardInfo.discordGuildChannels.value,
            setDashboardState: setDashboardInfo,
            canInteract: (!!stateCanInteract)
        });

    return (
        <div>
            <DashboardContainer>
                {handler.generateEightBallSection()}
            </DashboardContainer>
        </div>
    )
}