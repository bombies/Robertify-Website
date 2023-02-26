'use client';

import React, {CSSProperties} from "react";


export enum ButtonType {
    PRIMARY,
    SECONDARY,
    WARNING,
    DANGER,
}

const getButtonStyle = (type?: ButtonType): CSSProperties => {
    switch (type) {
        case ButtonType.PRIMARY: {
            return { backgroundColor: '#00D615' }
        }
        case ButtonType.SECONDARY: {
            return { backgroundColor: 'transparent', borderWidth: '2px', borderColor: '#00D615' }
        }
        case ButtonType.WARNING: {
            return { backgroundColor: '#ffa700' }
        }
        case ButtonType.DANGER: {
            return { backgroundColor: '#ff2c2c' }
        }
        default: {
            return { backgroundColor: '#00D615' }
        }
    }
}

interface Props extends React.PropsWithChildren {
    type?: ButtonType;
    width?: number;
    height?: number;
    className?: string;
    submit?: boolean;
}

export default function Button(props: Props) {
    return (
        <button className={'transition-fast hover:scale-105 rounded-lg text-white ' + props.className || ''} style={{
            width: props.width ? props.width + 'rem' : "inherit",
            height: props.height ? props.height + 'rem' : "inherit",
            ...getButtonStyle(props.type)
        }}>
            {props.children}
        </button>
    )
}