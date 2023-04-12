'use client';

import {SortDescriptor, Table, useAsyncList} from "@nextui-org/react";
import React from "react";
import {CommandData} from "@/app/commands/page";
import {useListData} from "@react-stately/data";

export type TableColumn = { name: string, uid: string, sortable?: boolean };

type Props = {
    data: CommandData[],
    columns: TableColumn[]
}

const removeDuplicates = <T,>(arr: T[]) => {
    return arr.filter((val, i) => arr.indexOf(val) === i);
}

const CommandTable = (props: Props) => {
    props.data = removeDuplicates(props.data);

    const sort = (opts: { items: any[], sortDescriptor: SortDescriptor }) => {
        return ({
            items: opts.items.sort((a, b) => {
                let primString = "", secString = "";

                switch (opts.sortDescriptor.column?.toString().toLowerCase()) {
                    case "command": {
                        primString = a.name;
                        secString = b.name;
                        break;
                    }
                    case "category": {
                        primString = a.category;
                        secString = b.category;
                        break;
                    }
                }

                if (opts.sortDescriptor.direction === 'ascending') {
                    return primString.localeCompare(secString);
                } else if (opts.sortDescriptor.direction === 'descending') {
                    return secString.localeCompare(primString);
                } else return 0;
            })
        })
    }

    const list = useAsyncList({
        load: async () => ({items: props.data}),
        sort
    })

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
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
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
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </Table.Column>
                )}
            </Table.Header>
            <Table.Body items={list.items || []}>
                {(command: CommandData) => (
                    <Table.Row>
                        {(columnKey) => (
                            <Table.Cell key={command.id}>{renderCell(command, columnKey)}</Table.Cell>
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

export default CommandTable