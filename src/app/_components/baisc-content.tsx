import React from "react";

interface Props extends React.PropsWithChildren {
    title?: string;
    description: string;
    childrenAlign?: 'left' | 'right';
}

export default function BasicContent(props: Props) {
    return (
        <div className={'justify-center flex gap-16 laptop:gap-4 tablet:gap-2 phone:flex-col ' + (props.childrenAlign === 'left' ? ' flex-row-reverse' : '')}>
            <div className='self-center'>
                {
                    props.title &&
                    <h1 className='text-4xl max-w-xl laptop:max-w-lg font-bold text-primary'>{props.title}</h1>
                }
                <p className='max-w-lg laptop:max-w-md dark:text-white'>{props.description}</p>
            </div>
            {props.children}
        </div>
    )
}