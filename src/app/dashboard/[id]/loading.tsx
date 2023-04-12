import {parseCardSize} from "@/components/card";
import SkeletonContentProvider from "@/components/skeletons/SkeletonContentProvider";
import SkeletonProvider from "@/components/skeletons/SkeletonProvider";

const Loading = () => {
    return (
        <main>
            <SkeletonProvider
                centered
                className={parseCardSize('xl') + ' flex gap-6 !p-12 mb-12'}
            >
                <SkeletonContentProvider className='h-32 w-32 !rounded-full'/>
                <SkeletonContentProvider className='self-center h-6 w-1/2 '/>
            </SkeletonProvider>
            <SkeletonProvider
                centered
                className={parseCardSize('xl') + ' flex gap-6 !p-12 mb-12 grid grid-cols-2 '}
            >
                <SkeletonContentProvider className='self-center h-6 w-full '/>
                <SkeletonContentProvider className='self-center h-6 w-full '/>
                <SkeletonContentProvider className='self-center h-6 w-1/2 '/>
                <SkeletonContentProvider className='self-center h-6 w-3/4 '/>
                <SkeletonContentProvider className='self-center h-6 w-1/3 '/>
                <SkeletonContentProvider className='self-center h-6 w-5/6 '/>
                <SkeletonContentProvider className='self-center h-6 w-1/2 '/>
                <SkeletonContentProvider className='self-center h-6 w-3/4 '/>
                <SkeletonContentProvider className='self-center h-6 w-1/3 '/>
                <br/>
                <SkeletonContentProvider className='self-center h-6 w-full '/>
                <SkeletonContentProvider className='self-center h-6 w-full '/>
                <SkeletonContentProvider className='self-center h-6 w-1/2 '/>
                <SkeletonContentProvider className='self-center h-6 w-3/4 '/>
                <SkeletonContentProvider className='self-center h-6 w-1/3 '/>
                <SkeletonContentProvider className='self-center h-6 w-5/6 '/>
                <SkeletonContentProvider className='self-center h-6 w-1/2 '/>
                <SkeletonContentProvider className='self-center h-6 w-3/4 '/>
                <SkeletonContentProvider className='self-center h-6 w-1/3 '/>
            </SkeletonProvider>
        </main>
    )
}

export default Loading