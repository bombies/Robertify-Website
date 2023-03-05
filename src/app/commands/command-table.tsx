'use client';

import {Table} from "@nextui-org/react";
import React from "react";
import {CommandData} from "@/app/commands/page";

type Props = {
    data: CommandData[],
    columns: { name: string, uid: string }[]
}

export default function CommandTable(props: Props) {
    const renderCell = (command: CommandData, columnKey: React.Key) => {
        // @ts-ignore
        const cellValue = command[columnKey];
        switch (columnKey) {
            case "command": {
                return <p>{command.name}</p>;
            }
            case "description": {
                return <p>{command.description}</p>;
            }
            case "category": {
                return <p>{command.category}</p>;
            }
            default:
                return cellValue
        }
    }

    return (
        <Table
            compact
            bordered
            aria-label="Command table"
            color='primary'
            selectionMode="none"
            css={{
                height: 'auto',
                minWidth: "100%",
            }}
        >
            <Table.Header
                columns={props.columns}
            >
                {(column) => (
                    <Table.Column
                        key={column.uid}
                        align='start'
                    >
                        {column.name}
                    </Table.Column>
                )}
            </Table.Header>
            <Table.Body items={props.data || []}>
                {(command: CommandData) => (
                    <Table.Row>
                        {(columnKey) => (
                            <Table.Cell>{renderCell(command, columnKey)}</Table.Cell>
                        )}
                    </Table.Row>
                )}
            </Table.Body>
            <Table.Pagination
                shadow
                noMargin
                align='center'
                rowsPerPage={15}
            />
        </Table>
    )
}