import HeadingSection from "@/components/heading-section";
import SkeletonCard from "@/components/skeletons/skeleton-card";

export default function Loading() {
    return (
        <main>
            <HeadingSection heading='Privacy Policy' />
            <div className='p-12 phone:p-3 flex flex-col gap-y-6 mx-auto justify-center'>
                <SkeletonCard centered size='lg' />
            </div>
        </main>
    )
}