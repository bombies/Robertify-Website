import AbstractDashboardHandler, {AbstractDashboardFields} from "@/app/dashboard/[id]/(categories)/abstract-dashboard-handler";
import {Table, Tooltip} from "@nextui-org/react";
import {TableColumn} from "@/app/commands/command-table";
import React from "react";
import IconButton from "@/components/button/IconButton";
import binIcon from '/public/discard.svg';
import Card from "@/components/card";

export default class DashboardMiscHandler extends AbstractDashboardHandler {
    constructor(opts: AbstractDashboardFields) {
        super(opts);
    }

    public generateEightBallTable() {
        if (!this.opts.robertifyGuild?.eight_ball)
            return;
        const responses = this.opts.robertifyGuild.eight_ball.map((r, i) => ({
            response: r,
            index: i
        }));

        if (responses.length === 0)
            return <Card size='sm' title='No Responses' description="You don't have any custom 8ball responses! Click on the button below to add some!" />

        const columns: TableColumn[] = [
            { name: 'RESPONSE', uid: 'response_col' },
            { name: 'ACTIONS', uid: 'actions_col' },
        ]

        const renderCell = (response: {response: string, index: number}, key: React.Key) => {
            switch (key) {
                case "response_col": return <p className='dark:text-white text-black'>{response.response}</p>
                case "actions_col": return <div className='flex gap-2'>
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