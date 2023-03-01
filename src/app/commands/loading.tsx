import HeadingSection from "@/components/heading-section";
import {Suspense} from "react";
import CommandTableContext from "@/app/commands/command-table-context";
import SkeletonTable from "@/components/skeletons/skeleton-table";

export default function Loading() {
    return (
        <main className='min-h-screen'>
            <HeadingSection heading='Commands' subheading='So... many... commands...' />
            <div className='py-12 px-24 tablet:px-12 phone:px-4'>
                <SkeletonTable/>
            </div>
        </main>
    )
}