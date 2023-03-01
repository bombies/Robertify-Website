import React from "react";

interface Props extends React.PropsWithChildren {
    heading: string;
}

export default function FooterGroup(props: Props) {
    return (
        <div className='flex flex-col gap-4'>
            <h3 className='font-semibold !text-primary dark:drop-shadow-glow-primary-lg'>{props.heading}</h3>
            <div className='phone:text-sm flex flex-col gap-4'>
                {props.children}
            </div>
        </div>
    )
}