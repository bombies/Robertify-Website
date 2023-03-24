'use client';

import React, {MouseEventHandler} from "react";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import {useDarkMode} from "@/app/_components/dark-mode-context";
import {ButtonType} from "@/components/button/ButtonType";
import {StaticImageData} from "next/image";
import GenericImage from "@/app/_components/GenericImage";
import {Property} from "csstype";

const getButtonStyle = (darkMode: boolean, type?: ButtonType): string => {
    switch (type) {
        case ButtonType.PRIMARY: return "bg-primary shadow-lg dark:shadow-primary/40 shadow-transparent";
        case ButtonType.SECONDARY: return "bg-transparent border-[1px] border-primary text-primary shadow-lg dark:shadow-primary/40 shadow-transparent";
        case ButtonType.WARNING: return "bg-warning shadow-lg dark:shadow-warning/40 shadow-transparent";
        case ButtonType.DANGER: return "bg-danger shadow-lg dark:shadow-danger/40 shadow-transparent";
        case ButtonType.INVERTED: return "bg-white dark:bg-dark text-primary shadow-lg dark:shadow-neutral-800/40 shadow-transparent";
        case ButtonType.CTA: return "bg-gradient-to-br bg-[length:200%_200%] animate-gradient-normal from-green-400 via-lime-500 to-amber-500 text-white shadow-lg dark:shadow-green-500/60 shadow-transparent"
        default: return "bg-primary shadow-lg dark:shadow-primary/40 shadow-transparent"
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
    colour?: Property.BackgroundColor
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
                <GenericImage
                    className='self-center'
                    src={props.icon}
                    width={1.25}
                />
            }
            <p className={'text-center text-white self-center ' + (props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY ? '!text-primary' : '')}>{props.label}</p>
        </div>
    )

    return (
        <>
            {
                props.href ?
                    <Link className={className + ' flex justify-center '}
                          style={{
                              ...styleObj,
                              backgroundColor: props.colour
                          }}
                          href={props.href}
                    >
                        <div className={'flex justify-center self-center gap-4' + ((props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY) ? ' text-primary' : '')  + ( props.className ? ` ${props.className}` : '')}>
                            {children}
                        </div>
                    </Link>
                    :
                    <button className={className}
                            style={{
                                ...styleObj
                            }}
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