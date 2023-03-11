import React from "react";

interface Props extends React.PropsWithChildren {
    title: string
}

export default function DashboardSection(props: Props) {
    return (
        <section className='p-6'>
            <h1 className='text-3xl font-bold text-primary dark:drop-shadow-glow-primary-lg mb-3'>{props.title}</h1>
            {props.children}
        </section>
    )
}