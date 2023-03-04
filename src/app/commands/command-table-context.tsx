import CommandTable from "@/app/commands/command-table";
import WebClient, {ExternalWebClient} from "@/utils/api/web-client";

export type CommandData = {
    id: number | string,
    name: string,
    description: string,
    category: 'music' | 'management' | 'utility' | 'miscellaneous'
}

const getCommandData = async ()  => {
    const externWebClient = await ExternalWebClient.instance();
    if (!externWebClient) return undefined
    return (await externWebClient.get('/commands')).data;
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