import AbstractDashboardHandler, {
    AbstractDashboardFields
} from "@/app/dashboard/[id]/(categories)/abstract-dashboard-handler";
import {Modal, Spacer, Table, Text, Textarea, Tooltip} from "@nextui-org/react";
import {TableColumn} from "@/app/commands/command-table";
import React, {useMemo, useState} from "react";
import IconButton from "@/components/button/IconButton";
import binIcon from '/public/red-bin.svg';
import Card from "@/components/card";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import {sendToast} from "@/utils/client-utils";
import DashboardSection from "@/app/dashboard/[id]/(categories)/dashboard-section";

export default class DashboardMiscHandler extends AbstractDashboardHandler {
    constructor(opts: AbstractDashboardFields) {
        super(opts);
    }


    public generateEightBallSection() {
        const [addEightBallResponse, setAddEightBallResponse] = useState(false);
        const [proposedResponse, setProposedResponse] = useState('');
        const toggleEightBallModal = () => {
            setAddEightBallResponse(prev => !prev);
        }

        const inputValidatorHelper = useMemo((): { text: string, color: 'primary' | 'error' | 'success' } => {
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

        return (
            <DashboardSection title='8 Ball'>
                <div className='w-3/4 mb-6'>
                    {this.generateEightBallTable()}
                </div>
                <Button
                    label='Add Response'
                    type={ButtonType.CTA}
                    width={8}
                    disabled={!this.opts.canInteract}
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
                        <Textarea
                            value={proposedResponse}
                            onChange={(e) => {
                                setProposedResponse(e.target.value)
                            }}
                            disabled={!this.opts.canInteract}
                            bordered
                            fullWidth
                            color={proposedResponse.length === 0 ? 'error' : inputValidatorHelper.color}
                            size="lg"
                            placeholder="Enter a response..."
                            aria-label='eightball-response-input'
                            status={proposedResponse.length === 0 ? 'error' : inputValidatorHelper.color}
                            helperColor={inputValidatorHelper.color}
                            helperText={inputValidatorHelper.text}
                        />
                        <Spacer y={.5} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            label='Add'
                            type={proposedResponse && proposedResponse.length <= 3500 ? ButtonType.CTA : ButtonType.DANGER}
                            width={5}
                            height={3}
                            disabled={!this.opts.canInteract}
                            onClick={() => {
                                if (!proposedResponse) {
                                    sendToast({
                                        description: "The response can't be empty!",
                                        type: ButtonType.DANGER
                                    });
                                    return;
                                } else if (proposedResponse.length > 3500) {
                                    sendToast({
                                        description: "The response can't be more than 3500 characters!",
                                        type: ButtonType.DANGER
                                    });
                                    return;
                                }

                                this.addEightBallResponse(proposedResponse);
                                setAddEightBallResponse(false);
                                setProposedResponse('');
                                sendToast({
                                    description: "Added your response successfully!",
                                    type: ButtonType.PRIMARY
                                })
                            }}
                        />
                    </Modal.Footer>
                </Modal>
            </DashboardSection>
        )
    }

    public generateEightBallTable() {
        if (!this.opts.robertifyGuild?.eight_ball)
            return;
        const responses = this.opts.robertifyGuild.eight_ball.map((r, i) => ({
            response: r,
            index: i
        }));

        if (responses.length === 0)
            return <Card size='sm' title='No Responses'
                         description="You don't have any custom 8ball responses! Click on the button below to add some!"/>

        const columns: TableColumn[] = [
            {name: 'RESPONSE', uid: 'response_col'},
            {name: 'ACTIONS', uid: 'actions_col'},
        ]

        const renderCell = (response: { response: string, index: number }, key: React.Key) => {
            switch (key) {
                case "response_col":
                    return <p className='dark:text-white text-black'>{response.response}</p>
                case "actions_col":
                    return <div className='flex gap-2'>
                        <Tooltip content='Delete Response' color='error'>
                            <IconButton
                                icon={binIcon}
                                onClick={() => this.removeEightBallResponse(response.response)}
                            />
                        </Tooltip>
                    </div>
            }
        }

        const disabledKeys = !this.opts.canInteract ? responses.map(r => r.index) : [];

        return (
            <Table
                compact
                sticked
                bordered
                aria-label="Command table"
                disabledKeys={disabledKeys}
                color='primary'
                css={{
                    height: 'auto',
                    minWidth: "50%",
                }}
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column key={column.uid}>
                            {column.name}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={responses}>
                    {(response) => (
                        <Table.Row
                            key={response.index}
                        >
                            {(columnKey) => (
                                <Table.Cell>{renderCell(response, columnKey)}</Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        )
    }

    public addEightBallResponse(response: string) {
        if (!this.isUsable()) return;

        this.opts.setCurrentData!(prevState => {
            if (!prevState) return;

            return ({
                ...prevState,
                eight_ball: [...prevState.eight_ball, response]
            })
        })
    }

    public removeEightBallResponse(response: string) {
        if (!this.isUsable()) return;

        this.opts.setCurrentData!(prevState => {
            if (!prevState) return;

            return ({
                ...prevState,
                eight_ball: prevState.eight_ball.filter(r => r !== response)
            })
        })
    }
}