'use client';

import React, {CSSProperties, MouseEventHandler} from "react";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;


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
            return { backgroundColor: 'transparent', borderWidth: '1px', borderColor: '#00D615', color: '#00D615' }
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
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button(props: Props) {
    return (
        <button className={'!cursor-pointer transition-fast hover:!scale-105 rounded-lg text-white ' + props.className || ''}
                style={{
                    width: props.width ? props.width + 'rem' : "inherit",
                    height: props.height ? props.height + 'rem' : "inherit",
                    ...getButtonStyle(props.type)
        }}
                disabled={props.disabled}
                onClick={props.onClick}
                type={props.submit === true ? 'submit' : 'button'}
        >
            <div className='flex justify-center p-2 gap-4'>
                {props.children}
            </div>
        </button>
    )
}