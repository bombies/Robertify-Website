'use client';

import {
    Pagination,
    SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {useMemo, useState} from "react";
import {CommandData} from "@/app/commands/page";

export type Column = { name: string, uid: string, sortable?: boolean };

type Props = {
    data: CommandData[],
    columns: Column[]
}

function removeDuplicates<T>(arr: T[]) {
    return arr.filter((val, i) => arr.indexOf(val) === i);
}

export default function CommandTable(props: Props) {
    const data = useMemo(() => removeDuplicates(props.data), [props.data]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    const pages = Math.ceil(data.length / rowsPerPage);

    const sortedItems = useMemo(() => {
        return data.sort((a, b) => {
            if (!sortDescriptor)
                return 0
            let primString = "", secString = "";

            switch (sortDescriptor.column?.toString().toLowerCase()) {
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

            if (sortDescriptor.direction === 'ascending') {
                return primString.localeCompare(secString);
            } else if (sortDescriptor.direction === 'descending') {
                return secString.localeCompare(primString);
            } else return 0;
        })
    }, [data, sortDescriptor])

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems]);

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
            isCompact
            aria-label="Command table"
            color='primary'
            bottomContent={
                <div className="flex justify-center w-full">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
                wrapper: "min-w-[100%] dark:bg-neutral-900/50 backdrop-blur-md border-1 border-black/20 dark:border-white/20",
                th: "dark:bg-black backdrop-blur-md dark:text-white uppercase"
            }}
        >
            <TableHeader
                columns={props.columns}
            >
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={items}>
                {(command: CommandData) => (
                    <TableRow key={command.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(command, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}