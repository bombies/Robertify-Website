import SkeletonProvider from "@/components/skeletons/SkeletonProvider";
import SkeletonContentProvider from "@/components/skeletons/SkeletonContentProvider";

const SkeletonTable = () => {
    return (
        <SkeletonProvider>
            <div className='space-y-3'>
                <SkeletonContentProvider className='h-6 rounded-lg'/>
                <div className='grid grid-cols-3 gap-3'>
                    <SkeletonContentProvider className="h-3 w-1/4 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-full rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/2 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-2/3 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-5/6 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/4 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/3 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-full rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-3/5 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/4 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-full rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/2 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-2/3 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-5/6 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/4 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/3 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-full rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-3/5 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/4 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-full rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/2 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-2/3 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-5/6 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/4 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-1/3 rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-full rounded-lg"/>
                    <SkeletonContentProvider className="h-3 w-3/5 rounded-lg"/>
                </div>
            </div>
        </SkeletonProvider>
    )
}

export default SkeletonTable