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
            return "bg-transparent border-[1px] border-primary text-primary shadow-lg dark:shadow-primary/40 shadow-transparent";
        }
        case ButtonType.WARNING: {
            return "bg-warning shadow-lg dark:shadow-warning/40 shadow-transparent";
        }
        case ButtonType.DANGER: {
            return "bg-danger shadow-lg dark:shadow-danger/40 shadow-transparent";
        }
        case ButtonType.INVERTED: {
            return "bg-white dark:bg-dark !text-primary shadow-lg dark:shadow-neutral-800/40 shadow-transparent";
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
    centered?: boolean;
}

export default function Button(props: Props) {
    const [ darkMode ] = useDarkMode();

    const className = '!cursor-pointer transition-fast hover:!scale-105 rounded-lg !text-white ' + getButtonStyle(darkMode, props.type) + ' ' + (props.className || '') + (typeof props.centered !== 'undefined' ? ' flex mx-auto' : '');
    const styleObj = {
        width: props.width ? props.width + 'rem' : "inherit",
        height: props.height ? props.height + 'rem' : "inherit",
    };

    const children = (
        <div className={'flex gap-[.25rem] justify-center'}>
            {props.icon &&
                <div className='relative w-5 h-5 self-center'>
                    <Image
                        draggable={false}
                        src={props.icon}
                        alt=''
                        fill={true}
                        sizes='1.25rem'
                    />
                </div>
            }
            <p className={'text-center text-white self-center ' + (props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY ? '!text-primary' : '')}>{props.label}</p>
        </div>
    )

    return (
        <>
            {
                props.href ?
                    <Link className={className + ' flex justify-center '}
                          style={styleObj}
                          href={props.href}
                    >
                        <div className={'flex justify-center self-center gap-4' + ((props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY) ? ' text-primary' : '')  + ( props.className ? ` ${props.className}` : '')}>
                            {children}
                        </div>
                    </Link>
                    :
                    <button className={className}
                            style={styleObj}
                            disabled={props.disabled}
                            onClick={(e) => {
                                e.preventDefault();
                                if (props.onClick)
                                    props.onClick(e);
                            }}
                            type={props.submit === true ? 'submit' : 'button'}
                    >
                        <div className={'flex justify-center p-2 gap-4 mx-auto' + ((props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY) ? ' text-primary' : '') + ( props.className ? ` ${props.className}` : '')}>
                            {props.isWorking ? <Spinner size={.75} /> : children}
                        </div>
                    </button>
            }
        </>
    )
}