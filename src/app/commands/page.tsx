import HeadingSection from "@/components/heading-section";
import {ExternalWebClient} from "@/utils/api/web-client";
import CommandTable from "@/app/commands/command-table";

export type CommandData = {
    id: number | string,
    name: string,
    description: string,
    category: 'music' | 'management' | 'utility' | 'miscellaneous'
}

const getCommandData = async ()  => {
    const externWebClient = await ExternalWebClient.getInstance();
    if (!externWebClient) return undefined
    return (await externWebClient.get('/commands')).data;
}

export default async function CommandsPage() {
    const data = await getCommandData();
    const columns = [
        { name: 'COMMAND', uid: 'command'},
        { name: 'DESCRIPTION', uid: 'description'},
        { name: 'CATEGORY', uid: 'category'},
    ]

    return (
        <main className='min-h-screen'>
            <HeadingSection heading='Commands' subheading='So... many... commands...' />
            <div className='py-12 px-24 tablet:px-12 phone:px-4'>
                <CommandTable data={data} columns={columns} />
            </div>
        </main>
    )
}