"use client"

import AbstractDashboardHandler, {
    AbstractDashboardFields
} from "@/app/dashboard/[id]/(categories)/abstract-dashboard-handler";
import {
    Modal,
    Spacer,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea
} from "@nextui-org/react";
import {Column} from "@/app/commands/command-table";
import React, {Dispatch, SetStateAction} from "react";
import IconButton from "@/components/button/IconButton";
import binIcon from '/public/red-bin.svg';
import Card from "@/components/card";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";
import {sendToast} from "@/utils/client-utils";
import DashboardSection from "@/app/dashboard/[id]/(categories)/dashboard-section";
import {ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import clsx from "clsx";

type EightBallFields = {
    toggleEightBallModal: () => void,
    addEightBallResponse: boolean,
    setAddEightBallResponse: Dispatch<SetStateAction<boolean>>
    proposedResponse: string,
    setProposedResponse: Dispatch<SetStateAction<string>>,
    eightBallValidator: { text: string, color: "primary" | "danger" | "success" }
}

export default class DashboardMiscHandler extends AbstractDashboardHandler {
    constructor(private readonly eightBall: EightBallFields, opts: AbstractDashboardFields) {
        super(opts);
    }


    public generateEightBallSection() {

        return (
            <DashboardSection title='8 Ball'>
                <div className='w-3/4 mb-6'>
                    {this.generateEightBallTable()}
                </div>
                <Button
                    label='Add Response'
                    type={ButtonType.CTA}
                    width={8}
                    disabled={!this.canInteract()}
                    onClick={this.eightBall.toggleEightBallModal}
                />
                <Modal
                    placement="center"
                    size="lg"
                    aria-labelledby="modal-title"
                    isOpen={this.eightBall.addEightBallResponse}
                    onClose={() => {
                        this.eightBall.setAddEightBallResponse(false)
                        this.eightBall.setProposedResponse('');
                    }}
                    backdrop="blur"
                    className={clsx(
                        "!bg-neutral-200/90 dark:!bg-neutral-950/90 backdrop-blur-md border-1 border-black/20 dark:border-white/20"
                    )}
                >
                    <ModalContent>
                        <ModalHeader>
                            <p className="text-xl">Add A Response</p>
                        </ModalHeader>
                        <ModalBody>
                            <Textarea
                                variant="faded"
                                value={this.eightBall.proposedResponse}
                                onChange={(e) => {
                                    this.eightBall.setProposedResponse(e.target.value)
                                }}
                                disabled={!this.canInteract()}
                                fullWidth
                                color={this.eightBall.proposedResponse.length === 0 ? 'danger' : this.eightBall.eightBallValidator.color}
                                size="lg"
                                placeholder="Enter a response..."
                                aria-label='eightball-response-input'
                                validationState={this.eightBall.proposedResponse.length === 0 ? 'invalid' : 'valid'}
                                errorMessage={this.eightBall.eightBallValidator.color === "danger" && this.eightBall.eightBallValidator.text}
                                description={this.eightBall.eightBallValidator.color !== "danger" && this.eightBall.eightBallValidator.text}
                                classNames={{
                                    inputWrapper: "dark:bg-neutral-900/50"
                                }}
                            />
                            <Spacer y={.5}/>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                label='Add'
                                type={this.eightBall.proposedResponse && this.eightBall.proposedResponse.length <= 3500 ? ButtonType.CTA : ButtonType.DANGER}
                                width={5}
                                height={3}
                                disabled={!this.canInteract()}
                                onClick={() => {
                                    if (!this.eightBall.proposedResponse) {
                                        sendToast({
                                            description: "The response can't be empty!",
                                            type: ButtonType.DANGER
                                        });
                                        return;
                                    } else if (this.eightBall.proposedResponse.length > 3500) {
                                        sendToast({
                                            description: "The response can't be more than 3500 characters!",
                                            type: ButtonType.DANGER
                                        });
                                        return;
                                    }

                                    this.addEightBallResponse(this.eightBall.proposedResponse);
                                    this.eightBall.setAddEightBallResponse(false);
                                    this.eightBall.setProposedResponse('');
                                    sendToast({
                                        description: "Added your response successfully!",
                                        type: ButtonType.PRIMARY
                                    })
                                }}
                            />
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </DashboardSection>
        )
    }

    public generateEightBallTable() {
        if (!this.getRobertifyGuild()?.eight_ball)
            return;
        const responses = this.getRobertifyGuild()?.eight_ball?.map((r, i) => ({
            response: r,
            index: i
        })) ?? [];

        if (responses.length === 0)
            return <Card size='sm' title='No Responses'
                         description="You don't have any custom 8ball responses! Click on the button below to add some!"/>

        const columns: Column[] = [
            {name: 'RESPONSE', uid: 'response_col'},
            {name: 'ACTIONS', uid: 'actions_col'},
        ]

        const renderCell = (response: { response: string, index: number }, key: React.Key) => {
            switch (key) {
                case "response_col":
                    return <p className='dark:text-white text-black'>{response.response}</p>
                case "actions_col":
                    return <div className='flex gap-2'>
                        <IconButton
                            icon={binIcon}
                            onClick={() => this.removeEightBallResponse(response.response)}
                            tooltipProps={{
                                content: "Delete Response",
                                color: "danger"
                            }}
                        />
                    </div>
            }
        }

        const disabledKeys = !this.canInteract() ? responses.map(r => r.index) : [];

        return (
            <Table
                isCompact
                aria-label="Command table"
                disabledKeys={disabledKeys}
                color='primary'
                className="min-w-[50%]"
                classNames={{
                    wrapper: "min-w-[100%] dark:bg-neutral-900/50 backdrop-blur-md border-1 border-black/20 dark:border-white/20",
                    th: "dark:bg-black backdrop-blur-md dark:text-white uppercase"
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={responses}>
                    {(response) => (
                        <TableRow
                            key={response.index}
                        >
                            {(columnKey) => (
                                <TableCell
                                    className="z-[2]"
                                >{renderCell(response, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        )
    }

    public addEightBallResponse(response: string) {
        if (!this.isUsable()) return;

        this.setCurrentData(prevState => {
            if (!prevState) return;

            return ({
                ...prevState,
                eight_ball: prevState.eight_ball ? [...prevState.eight_ball, response] : [response]
            })
        });
    }

    public removeEightBallResponse(response: string) {
        if (!this.isUsable()) return;

        this.setCurrentData(prevState => {
            if (!prevState) return;

            return ({
                ...prevState,
                eight_ball: prevState.eight_ball?.filter(r => r !== response) ?? []
            })
        })
    }
}