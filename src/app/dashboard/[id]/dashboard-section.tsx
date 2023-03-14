import React from "react";

interface Props extends React.PropsWithChildren {
    title: string,
    className?: string,
}

export default function DashboardSection(props: Props) {
    return (
        <section className='p-6 phone:p-0 mx-auto'>
            <h1 className='text-3xl font-bold text-primary dark:drop-shadow-glow-primary-lg mb-3'>{props.title}</h1>
            <div className={props.className}>
                {props.children}
            </div>
        </section>
    )
}