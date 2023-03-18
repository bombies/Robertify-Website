import React, {CSSProperties, MouseEventHandler} from "react";
import Link from "next/link";

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props extends React.PropsWithChildren {
    title?: string;
    description?: string;
    spacers?: boolean;
    hoverable?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>
    size?: ComponentSize;
    className?: string;
    centered?: boolean;
    href?: string;
    style?: CSSProperties;
}

export const parseCardSize = (size?: ComponentSize) => {
    switch (size) {
        case 'xs': return 'w-[20rem] tablet:w-[15rem] phone:w-[10rem]';
        case 'sm': return 'w-[30rem] tablet:w-[20rem] phone:w-[15rem]';
        case 'md': return 'w-[40rem] tablet:w-[30rem] phone:w-[20rem]';
        case 'lg': return 'w-[50rem] tablet:w-[40rem] phone:w-[25rem]';
        case 'xl': return 'w-[70rem] tablet:w-[55rem] phone:w-[30rem]';
        default: return 'w-[20rem] tablet:w-[15rem] phone:w-[10rem]';
    }
}

export default function Card(props: Props) {
    const card = (
        <div
            onClick={props.onClick}
            className={'bg-neutral-200/50 dark:bg-neutral-900 rounded-xl shadow-lg p-6 phone:p-3 ' + (parseCardSize(props.size)) + ' ' + (props.className || '') + (typeof props.hoverable !== 'undefined' ? ' transition-fast hover:scale-105' : '') + (typeof props.centered !== 'undefined' ? ' mx-auto' : '')}
        >
            {props.title && (
                <h3 className='font-semibold text-primary dark:drop-shadow-glow-primary-lg text-4xl phone:text-lg'>{props.title}</h3>
            )}
            {props.description && (
                <p className='whitespace-pre-line overflow-hidden text-ellipsis'>{props.description.replaceAll(/(\\n)|(<br\s?\/>)/g, '\n')}</p>
            )}
            {props.children && (
                props.children
            )}
        </div>
    )

    if (props.href)
        return (
            <Link
                href={props.href}
                className={'bg-neutral-200/50 dark:bg-neutral-900/50 backdrop-blur-lg rounded-xl shadow-lg p-6 phone:p-3 ' + (parseCardSize(props.size)) + ' ' + (props.className || '') + (typeof props.hoverable !== 'undefined' ? ' transition-fast hover:scale-105' : '') + (typeof props.centered !== 'undefined' ? ' mx-auto' : '')}
                style={props.style}
            >
                {props.title && (
                    <h3 className='font-semibold text-primary dark:drop-shadow-glow-primary-lg text-2xl phone:text-lg'>{props.title}</h3>
                )}
                {props.description && (
                    <p className='whitespace-pre-line overflow-hidden text-ellipsis'>{props.description.replaceAll(/(\\n)|(<br\s?\/>)/g, '\n')}</p>
                )}
                {props.children && (
                    props.children
                )}
            </Link>
        )

    return card;
}