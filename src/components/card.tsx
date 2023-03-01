import React from "react";

export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

interface Props extends React.PropsWithChildren {
    title?: string;
    description?: string;
    spacers?: boolean;
    size?: CardSize;
    className?: string;
}

const parseSize = (size?: CardSize) => {
    switch (size) {
        case 'xs': return '20rem';
        case 'sm': return '30rem';
        case 'md': return '40rem';
        case 'lg': return '50rem';
        case 'xl': return '60rem';
        case '2xl': return '70rem';
        case '3xl': return '80rem';
        case '4xl': return '90rem';
        case '5xl': return '100rem';
        default: return '20rem';
    }
}

export default function Card(props: Props) {
    return (
        <div
            className={'bg-neutral-200/50 dark:bg-neutral-900/50 backdrop-blur-lg rounded-xl shadow-lg py-3 px-6 ' + (props.className || '')}
            style={{
            width: parseSize(props.size),
        }}>
            {props.title && (
                <h3 className='font-semibold text-primary dark:drop-shadow-glow-primary-lg'>{props.title}</h3>
            )}
            {props.description && (
                <p>{props.description}</p>
            )}
            {props.children && (
                props.children
            )}
        </div>
    )
}