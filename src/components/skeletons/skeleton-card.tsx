import SkeletonProvider from "@/components/skeletons/SkeletonProvider";
import {ComponentSize, parseCardSize} from "@/components/card";
import SkeletonContentProvider from "@/components/skeletons/SkeletonContentProvider";

type Props = {
    size?: ComponentSize,
    centered?: boolean,
    className?: string,
}

const SkeletonCard = (props: Props) => {
    return (
        <SkeletonProvider centered={props.centered} className={parseCardSize(props.size) + ' ' + props.className}>
            <div className='space-y-6'>
                <SkeletonContentProvider className='h-4 w-4/5'/>
                <div className='space-y-3'>
                    <SkeletonContentProvider className='h-2 w-3/5'/>
                    <SkeletonContentProvider className='h-2 w-3/5'/>
                    <SkeletonContentProvider className='h-2 w-3/5'/>
                    <SkeletonContentProvider className='h-2 w-3/5'/>
                    <SkeletonContentProvider className='h-2 w-3/5'/>
                    <SkeletonContentProvider className='h-2 w-3/5'/>
                    <SkeletonContentProvider className='h-2 w-2/5'/>

                </div>
            </div>
        </SkeletonProvider>
    )
}

export default SkeletonCard