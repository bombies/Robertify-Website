'use client';

import DashboardContainer from "@/app/dashboard/[id]/(categories)/dashboard-container";
import {useDashboardState} from "@/app/dashboard/[id]/(categories)/dashboard-state-context";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import DashboardSection from "@/app/dashboard/[id]/(categories)/dashboard-section";
import DashboardMiscHandler from "@/app/dashboard/[id]/(categories)/misc/dashboard-misc-handler";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import {Input, Modal, Text} from "@nextui-org/react";

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

    const [ addEightBallResponse, setAddEightBallResponse ] = useState(false);
    const [ proposedResponse, setProposedResponse ] = useState('');
    const toggleEightBallModal = () => {
        setAddEightBallResponse(prev => !prev);
    }

    return (
        <div>
            <DashboardContainer>
                <DashboardSection title='8 Ball'>
                    <div className='w-3/4 mb-6'>
                        {handler.generateEightBallTable()}
                    </div>
                    <Button
                        label='Add Response'
                        type={ButtonType.CTA}
                        width={8}
                        disabled={!stateCanInteract}
                        onClick={toggleEightBallModal}
                    />
                    <Modal
                        width="600px"
                        closeButton
                        aria-labelledby="modal-title"
                        open={addEightBallResponse}
                        onClose={() => {
                            setAddEightBallResponse(false)
                            setProposedResponse('');
                        }}
                        css={{
                            backgroundColor: '$background'
                        }}
                    >
                        <Modal.Header>
                            <Text id='modal-title' size={18}>Add A Response</Text>
                        </Modal.Header>
                        <Modal.Body>
                            <Input
                                value={proposedResponse}
                                onChange={(e) => {
                                    setProposedResponse(e.target.value)
                                }}
                                disabled={!stateCanInteract}
                                clearable
                                bordered
                                fullWidth
                                color="primary"
                                size="lg"
                                placeholder="Enter a response..."
                                aria-label='eightball-response-input'
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                label='Add'
                                width={5}
                                height={3}
                                disabled={!stateCanInteract}
                                onClick={() => {
                                    handler.addEightBallResponse(proposedResponse);
                                    setAddEightBallResponse(false);
                                    setProposedResponse('');
                                }}
                            />
                        </Modal.Footer>
                    </Modal>
                </DashboardSection>
            </DashboardContainer>
        </div>
    )
}