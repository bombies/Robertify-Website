import {MouseEventHandler} from "react";

type Props = {
    status: boolean,
    onClick?: MouseEventHandler<HTMLDivElement>
    disabled?: boolean;
}

export default function Toggle(props: Props) {
    return (
        <div
            className={'relative w-16 h-8 p-2 transition-fast rounded-full dark:bg-dark bg-neutral-100 shadow-md cursor-pointer ' + (props.status ? '!bg-primary' : '') + (props.disabled ? ' brightness-50' : '')}
            onClick={(e) => {
                if (props.disabled)
                    return;
                if (props.onClick)
                    props.onClick(e);
            }}
        >
            <div className={'transition-fast h-4 w-4 rounded-full bg-primary shadow-md dark:shadow-primary/30 !ease-out ' + (props.status ? 'translate-x-[200%] !bg-white' : '')}></div>
        </div>
    )
}