import HeadingSection from "@/components/heading-section";
import Card from "@/components/card";
import Button from "@/components/button/Button";
import SkeletonCard from "@/components/skeletons/skeleton-card";

export default function Loading() {
    return (
        <main>
            <HeadingSection heading='Vote' subheading='Thank you for taking interest in supporting us!' />
            <div className='p-12'>
                <SkeletonCard size='md' centered />
            </div>
        </main>
    )
}