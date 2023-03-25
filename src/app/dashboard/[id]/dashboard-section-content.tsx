import React from "react";

interface Props extends React.PropsWithChildren {
    title: string,
    description?: string,
    contentAlign?: 'beside' | 'below'
}

export default function DashboardSectionContent(props: Props) {
    return (
        <div className={'flex ' + (props.contentAlign === 'below' ? 'flex-col' : 'justify-between')}>
            <div className={props.contentAlign === 'below' ? 'mb-4' : 'w-2/3'}>
                <h3 className='text-primary text-2xl font-semibold dark:drop-shadow-glow-primary-lg'>{props.title}</h3>
                {props.description && <p className='text-[1rem] tracking-wider text-secondary dark:text-white'>{props.description}</p>}
            </div>
            {props.children}
        </div>
    )
}