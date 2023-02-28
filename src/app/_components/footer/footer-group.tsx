import React from "react";

interface Props extends React.PropsWithChildren {
    heading: string;
}

export default function FooterGroup(props: Props) {
    return (
        <div className='flex flex-col gap-4'>
            <h3 className='dark:text-white font-semibold'>{props.heading}</h3>
            <div className='phone:text-sm flex flex-col gap-4g'>
                {props.children}
            </div>
        </div>
    )
}