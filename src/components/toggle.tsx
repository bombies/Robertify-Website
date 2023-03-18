import {MouseEventHandler} from "react";

type Props = {
    status: boolean,
    onClick?: MouseEventHandler<HTMLDivElement>
    disabled?: boolean;
}

export default function Toggle(props: Props) {
    return (
        <div
            className={'relative w-12 h-6 transition-fast rounded-full dark:bg-dark bg-neutral-100 shadow-md cursor-pointer ' + (props.status ? '!bg-primary' : '') + (props.disabled ? ' brightness-50' : '')}
            onClick={(e) => {
                if (props.disabled)
                    return;
                if (props.onClick)
                    props.onClick(e);
            }}
        >
            <div className={'absolute transition-fast h-6 w-6 rounded-full bg-primary shadow-md dark:shadow-primary/30 ' + (props.status ? 'right-0 !bg-white' : 'left-0')}></div>
        </div>
    )
}