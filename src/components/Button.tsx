'use client';

import React, {CSSProperties, MouseEventHandler} from "react";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import Link from "next/link";


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
    href?: string;
}

export default function Button(props: Props) {
    const className = '!cursor-pointer transition-fast hover:!scale-105 rounded-lg !text-white ' + props.className || '';
    const styleObj = {
        width: props.width ? props.width + 'rem' : "inherit",
        height: props.height ? props.height + 'rem' : "inherit",
        ...getButtonStyle(props.type)
    };

    return (
        <>
            {
                props.href ?
                    <Link className={className + ' flex justify-center'}
                          style={styleObj}
                          href={props.href}
                    >
                        <div className='flex justify-center self-center gap-4'>
                            {props.children}
                        </div>
                    </Link>
                    :
                    <button className={className}
                            style={styleObj}
                            disabled={props.disabled}
                            onClick={props.onClick}
                            type={props.submit === true ? 'submit' : 'button'}
                    >
                        <div className='flex justify-center p-2 gap-4'>
                            {props.children}
                        </div>
                    </button>
            }
        </>
    )
}