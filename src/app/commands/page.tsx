import HeadingSection from "@/components/heading-section";
import WebClient, {ExternalWebClient} from "@/utils/api/web-client";
import CommandTable, {Column} from "@/app/commands/command-table";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export type CommandData = {
    id: number | string,
    name: string,
    description: string,
    category: 'music' | 'management' | 'utility' | 'miscellaneous'
}

const getCommandData = async ()  => {
    const session = await getServerSession(authOptions);
    const externWebClient = ExternalWebClient.getInstance();
    if (!externWebClient) return undefined
    const webClient = WebClient.getInstance(session?.user);
    return (await webClient.get('/api/commands')).data.data;
}

export default async function CommandsPage() {
    const data = await getCommandData();

    const columns: Column[] = [
        { name: 'COMMAND', uid: 'command', sortable: true},
        { name: 'DESCRIPTION', uid: 'description'},
        { name: 'CATEGORY', uid: 'category', sortable: true},
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