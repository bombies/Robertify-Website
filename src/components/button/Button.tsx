'use client';

import React, {MouseEventHandler} from "react";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import {useDarkMode} from "@/app/_components/dark-mode-context";
import {ButtonType} from "@/components/button/ButtonType";
import Image, {StaticImageData} from "next/image";

const getButtonStyle = (darkMode: boolean, type?: ButtonType): string => {
    switch (type) {
        case ButtonType.PRIMARY: {
            return "bg-primary shadow-lg dark:shadow-primary/40 shadow-transparent";
        }
        case ButtonType.SECONDARY: {
            return "bg-transparent border-[1px] border-primary text-primary";
        }
        case ButtonType.WARNING: {
            return "bg-warning";
        }
        case ButtonType.DANGER: {
            return "bg-danger";
        }
        case ButtonType.INVERTED: {
            return "bg-white dark:bg-neutral-800 text-primary";
        }
        default: {
            return "bg-primary shadow-lg dark:shadow-primary/40 shadow-transparent"
        }
    }
}

interface Props {
    label: string,
    icon?: string | StaticImageData,
    type?: ButtonType;
    width?: number;
    height?: number;
    className?: string;
    submit?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>
    href?: string;
    isWorking?: boolean;
}

export default function Button(props: Props) {
    const [ darkMode ] = useDarkMode();

    const className = '!cursor-pointer transition-fast hover:!scale-105 rounded-lg !text-white ' + getButtonStyle(darkMode, props.type) + ' ' + (props.className || '');
    const styleObj = {
        width: props.width ? props.width + 'rem' : "inherit",
        height: props.height ? props.height + 'rem' : "inherit",
    };

    const children = (
        <div className='flex gap-[.25rem] justify-center'>
            {props.icon &&
                <div className='relative w-5 h-5 self-center'>
                    <Image src={props.icon} alt='' fill={true} />
                </div>
            }
            <p>{props.label}</p>
        </div>
    )

    return (
        <>
            {
                props.href ?
                    <Link className={className + ' flex justify-center'}
                          style={styleObj}
                          href={props.href}
                    >
                        <div className={'flex justify-center self-center gap-4' + ((props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY) ? ' text-primary' : '')}>
                            {children}
                        </div>
                    </Link>
                    :
                    <button className={className}
                            style={styleObj}
                            disabled={props.disabled}
                            onClick={props.onClick}
                            type={props.submit === true ? 'submit' : 'button'}
                    >
                        <div className={'flex justify-center p-2 gap-4' + ((props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY) ? ' text-primary' : '')}>
                            {props.isWorking ? <Spinner size={.75} /> : children}
                        </div>
                    </button>
            }
        </>
    )
}