import CommandTable from "@/app/commands/command-table";
import {ExternalWebClient} from "@/utils/api/web-client";

export type CommandData = {
    id: number | string,
    name: string,
    description: string,
    category: 'music' | 'management' | 'utility' | 'miscellaneous'
}

const getCommandData = async ()  => {
    const externWebClient = await ExternalWebClient.getInstance();
    if (!externWebClient) return undefined
    try {
        return (await externWebClient.get('/commands')).data;
    } catch (e: any) {
        console.error("There was an error attempting to fetch command info:", e.response.data)
    }
}

export default async function CommandTableContext() {
    const data = await getCommandData();
    const columns = [
        { name: 'COMMAND', uid: 'command'},
        { name: 'DESCRIPTION', uid: 'description'},
        { name: 'CATEGORY', uid: 'category'},
    ]

    return (
        <CommandTable data={data} columns={columns} />
    )
}