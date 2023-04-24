'use client';

import {Badge, CSS} from "@nextui-org/react";
import React, {MouseEventHandler} from "react";

interface Props extends React.PropsWithChildren {
    color?: 'primary' | 'warning' | 'error' | 'success' | 'secondary',
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    content?: string,
    classname?: string,
    onClick?: MouseEventHandler<HTMLDivElement>,
    css?: CSS
}

export default function BadgeWrapper(props: Props) {
    return (
        <div className={'self-center ' + (props.classname ?? '')}>
            <Badge
                disableOutline
                enableShadow
                color={props.color}
                content={props.content}
                size={props.size}
                className={props.classname}
                onClick={props.onClick}
                css={{
                    'color': 'white',
                    zIndex: 2,
                    ...props.css
                }}
            >
                {props.children}
            </Badge>
        </div>
    )
}