type Props = {
    className: string;
}

const SkeletonContentProvider = (props: Props) => {
    return <div className={props.className + ' rounded-xl bg-neutral-300 dark:bg-neutral-700'}/>
}

export default SkeletonContentProvider