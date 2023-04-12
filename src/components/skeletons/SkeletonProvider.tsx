import React from "react";

interface Props extends React.PropsWithChildren {
    className?: string;
    centered?: boolean;
}

const SkeletonProvider = (props: Props) => {
    return (
        <div
            className={'rounded-2xl h-fit bg-neutral-100 dark:bg-neutral-900/80 p-4 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-neutral-500/10 dark:before:via-white/10 before:to-transparent ' + (props.className || '') + (typeof props.centered !== 'undefined' ? ' mx-auto' : '')}>
            {props.children}
        </div>
    )
}

export default SkeletonProvider