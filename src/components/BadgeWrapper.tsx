'use client';

import {Badge} from "@nextui-org/react";
import React from "react";

interface Props extends React.PropsWithChildren {
    color?: 'primary' | 'warning' | 'error' | 'success' | 'secondary',
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    content?: string,
    classname?: string
}

const BadgeWrapper = (props: Props) => {
    return (
        <div className={'self-center ' + (props.classname ?? '')}>
            <Badge
                disableOutline
                enableShadow
                color={props.color}
                content={props.content}
                size={props.size}
                className={'!z-2 ' + (props.classname ?? '')}
                css={{
                    'color': 'white',
                    zIndex: 2
                }}
            >
                {props.children}
            </Badge>
        </div>
    )
}

export default BadgeWrapper