import React from "react";

interface Props extends React.PropsWithChildren {
    title: string,
    description?: string,
    className?: string,
}

const DashboardSection = (props: Props) => {
    return (
        <section className='p-6 phone:p-0 mx-auto'>
            <h1 className='text-3xl font-bold text-primary drop-shadow-glow-primary-lg mb-3'>{props.title}</h1>
            {props.description && <div className='bg-primary/10 dark:bg-dark/50 rounded-xl p-6 mb-12'><h3
                className='text-xl text-secondary dark:text-white w-3/4'>{props.description}</h3></div>}
            <div className={props.className}>
                {props.children}
            </div>
        </section>
    )
}

export default DashboardSection