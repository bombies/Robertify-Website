import HeadingSection from "@/components/heading-section";
import CommandTableContext from "./command-table-context";
import {Suspense} from "react";
import SkeletonTable from "@/components/skeletons/skeleton-table";

export default async function CommandsPage() {
    return (
        <main className='min-h-screen'>
            <HeadingSection heading='Commands' subheading='So... many... commands...' />
            <div className='py-12 px-24 tablet:px-12 phone:px-4'>
                <Suspense fallback={<SkeletonTable/>}>
                    {/* @ts-expect-error Async Server Component */}
                    <CommandTableContext/>
                </Suspense>
            </div>
        </main>
    )
}