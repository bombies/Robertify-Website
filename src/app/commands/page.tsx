import HeadingSection from "@/components/heading-section";
import CommandTableContext from "./command-table-context";
import {Suspense} from "react";

export default async function CommandsPage() {
    return (
        <main className='min-h-screen'>
            <HeadingSection heading='Commands' subheading='So... many... commands...' />
            <div className='py-12 px-24'>
                <Suspense fallback={<div>Loading...</div>}>
                    {/* @ts-expect-error Async Server Component */}
                    <CommandTableContext/>
                </Suspense>
            </div>
        </main>
    )
}