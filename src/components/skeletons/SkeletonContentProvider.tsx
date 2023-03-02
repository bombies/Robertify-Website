type Props = {
    className: string;
}

export default function SkeletonContentProvider(props: Props) {
    return <div className={props.className + ' rounded-xl bg-neutral-300 dark:bg-neutral-700'}  />
}