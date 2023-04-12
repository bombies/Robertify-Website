import React from "react";

interface Props extends React.PropsWithChildren {
    heading: string;
}

const FooterGroup = (props: Props) => {
    return (
        <div className='flex flex-col gap-4 phone:gap-2'>
            <h3 className='font-semibold !text-primary text-lg drop-shadow-glow-primary-lg'>{props.heading}</h3>
            <div className='phone:text-sm flex flex-col gap-4 phone:gap-2 '>
                {props.children}
            </div>
        </div>
    )
}

export default FooterGroup