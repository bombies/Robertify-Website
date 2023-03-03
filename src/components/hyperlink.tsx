import Link from "next/link";
import React from "react";
import {Url} from "url";


interface Props extends React.PropsWithChildren {
    href: Url | string;
    className?: string;
}
export default function HyperLink(props: Props) {
    return (
        <Link as={props.href} className={'dark:text-white dark:hover:!text-primary hover:!text-primary transition-fast text-black ' + props.className} href={props.href}>
            {props.children}
        </Link>
    )
}