import CommandTable from "@/app/commands/command-table";
import WebClient from "@/utils/api/web-client";

export type CommandData = {
    id: number | string,
    name: string,
    description: string,
    category: 'music' | 'management' | 'utility' | 'miscellaneous'
}

const getCommandData = async ()  => {
    const webClient = WebClient.getInstance();
    return (await webClient.get('/api/commands')).data;
}

export default async function CommandTableContext() {
    const data = (await getCommandData())?.data;
    const columns = [
        { name: 'COMMAND', uid: 'command'},
        { name: 'DESCRIPTION', uid: 'description'},
        { name: 'CATEGORY', uid: 'category'},
    ]

    return (
        <CommandTable data={data} columns={columns} />
    )
}