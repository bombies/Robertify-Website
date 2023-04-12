import React from "react";

interface Props extends React.PropsWithChildren {
    heading: string,
    subheading?: string,
}

const HeadingSection = (props: Props) => {
    return (
        <div className='relative m-auto default-bg text-center p-32 phone:px-8 pointer-events-none phone:py-32'>
            <h1 className='text-white font-black uppercase text-7xl phone:text-4xl tracking-[0.5rem] phone:tracking-[0.25rem] mb-6 mx-auto'>{props.heading}</h1>
            {props.subheading &&
                <h3 className='text-white font-light text-2xl phone:text-xl tracking-wide mb-6 max-w-2xl mx-auto'>{props.subheading}</h3>}
            {props.children}
        </div>
    )
}

export default HeadingSection