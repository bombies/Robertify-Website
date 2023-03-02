import HeadingSection from "@/components/heading-section";
import Card from "@/components/card";
import SkeletonCard from "@/components/skeletons/skeleton-card";
import Button from "@/components/button/Button";

export default function Loading() {
    return (
        <main>
            <HeadingSection heading='Support' subheading='All the help you need!' />
            <div className='p-12'>
                <div className='grid grid-cols-3 phone:grid-cols-1 tablet:grid-cols-2 gap-12 tablet:gap-6'>
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                    <SkeletonCard size='sm' />
                </div>
            </div>
        </main>
    )
}