import Link from "next/link";
import React from "react";
import {Url} from "url";


interface Props extends React.PropsWithChildren {
    href: Url | string;
    className?: string;
    newTab?: boolean
}
export default function HyperLink(props: Props) {
    return (
        <Link
            as={props.href}
            className={'dark:text-white dark:hover:!text-primary hover:!text-primary transition-fast text-black ' + props.className}
            href={props.href}
            target={props.newTab === false ?  undefined : "_blank"}
        >
            {props.children}
        </Link>
    )
}