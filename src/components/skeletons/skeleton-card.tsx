import SkeletonProvider from "@/components/skeletons/SkeletonProvider";
import {CardSize, parseCardSize} from "@/components/card";
import SkeletonContentProvider from "@/components/skeletons/SkeletonContentProvider";

type Props = {
    size?: CardSize
}

export default function SkeletonCard(props: Props) {
    return (
        <SkeletonProvider className={parseCardSize(props.size)}>
            <div className='space-y-6'>
                <SkeletonContentProvider className='h-4 w-4/5' />
                <div className='space-y-3'>
                    <SkeletonContentProvider className='h-2 w-3/5' />
                    <SkeletonContentProvider className='h-2 w-3/5' />
                    <SkeletonContentProvider className='h-2 w-3/5' />
                    <SkeletonContentProvider className='h-2 w-3/5' />
                    <SkeletonContentProvider className='h-2 w-3/5' />
                    <SkeletonContentProvider className='h-2 w-3/5' />
                    <SkeletonContentProvider className='h-2 w-2/5' />

                </div>
            </div>
        </SkeletonProvider>
    )
}