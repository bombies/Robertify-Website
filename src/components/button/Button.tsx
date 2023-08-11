'use client';

import React, {MouseEventHandler, useState} from "react";
import Link from "next/link";
import {ButtonType} from "@/components/button/ButtonType";
import {StaticImageData} from "next/image";
import GenericImage from "@/app/_components/GenericImage";
import {ToastDataProps} from "@/components/ToastComponent";
import {sendToast} from "@/utils/client-utils";
import {Spinner} from "@nextui-org/react";

export const getButtonStyle = (type?: ButtonType): string => {
    switch (type) {
        case ButtonType.PRIMARY:
            return "bg-primary shadow-lg shadow-primary/40";
        case ButtonType.BLUE:
            return "bg-[#6064f4] shadow-lg shadow-[#6064f4]/40";
        case ButtonType.GREY:
            return "bg-[#50545c] shadow-lg shadow-[#50545c]/40";
        case ButtonType.SECONDARY:
            return "bg-transparent border-[1px] border-primary text-primary dark:shadow-lg shadow-primary/40";
        case ButtonType.WARNING:
            return "bg-warning shadow-lg shadow-warning/40";
        case ButtonType.DANGER:
            return "bg-danger shadow-lg shadow-danger/40";
        case ButtonType.INVERTED:
            return "bg-white dark:bg-dark text-primary dark:shadow-lg shadow-neutral-800/40";
        case ButtonType.CTA:
            return "bg-gradient-to-br bg-[length:200%_200%] animate-gradient-normal from-green-400 via-lime-500 to-amber-500 text-white shadow-lg shadow-green-500/60"
        default:
            return `bg-primary shadow-lg shadow-primary/40`
    }
}

interface Props {
    label?: string,
    icon?: string | StaticImageData,
    type?: ButtonType;
    width?: number;
    height?: number;
    className?: string;
    submit?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>
    hrefClick?: MouseEventHandler<HTMLAnchorElement>
    href?: string;
    newTab?: boolean;
    isWorking?: boolean;
    centered?: boolean;
    toast?: ToastDataProps;
    cooldown?: number;
}

export default function Button(props: Props) {
    const [lastClick, setLastClick] = useState<number | undefined>(undefined);

    const isOnCoolDown = (): boolean => {
        if (props.cooldown === undefined)
            return false;
        if (lastClick === undefined)
            return false;

        const curTime = new Date().getTime();
        return curTime - lastClick <= (props.cooldown * 1000);
    }

    const className = '!cursor-pointer transition-fast laptop:hover:!-translate-y-[1px] rounded-lg !text-white ' + getButtonStyle(props.type) + ' ' + (props.className || '') + (typeof props.centered !== 'undefined' ? ' flex mx-auto' : '');
    const styleObj = {
        width: props.width ? props.width + 'rem' : "inherit",
        height: props.height ? props.height + 'rem' : "inherit",
    };

    const children = (
        <div className={'flex gap-[.25rem] justify-center'}>
            {props.icon &&
                <GenericImage
                    className='self-center align-middle'
                    src={props.icon}
                    width={1.25}
                />
            }
            {props.label &&
                <p className={'text-center text-white self-center ' + (props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY ? '!text-primary' : '')}>{props.label}</p>
            }
        </div>
    )

    return (
        <>
            {
                props.href ?
                    <Link
                        style={{
                            ...styleObj
                        }}
                        className={className + ' flex justify-center '}
                        href={props.href}
                        target={props.newTab === false ? undefined : "_blank"}
                        rel={props.newTab !== false ? 'noopener noreferrer' : undefined}
                        onClick={props.hrefClick}
                    >
                        <div
                            className={'flex justify-center self-center gap-4' + ((props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY) ? ' text-primary' : '') + (props.className ? ` ${props.className}` : '')}>
                            {children}
                        </div>
                    </Link>
                    :
                    <button className={className}
                            style={{
                                ...styleObj,
                            }}
                            disabled={props.disabled}
                            onClick={(e) => {
                                e.preventDefault();

                                if (!isOnCoolDown()) {
                                    if (props.onClick)
                                        props.onClick(e);
                                    if (props.toast)
                                        sendToast(props.toast)
                                    setLastClick(new Date().getTime());
                                } else {
                                    sendToast({
                                        type: ButtonType.WARNING,
                                        title: "Slow down!",
                                        description: `Woah there! This button is on cooldown. You may use it again in ${(Math.abs(new Date().getTime() - (lastClick! + (props.cooldown! * 1000))) / 1000).toFixed(0)} seconds!`
                                    })
                                }
                            }}
                            type={props.submit === true ? 'submit' : 'button'}
                    >
                        <div
                            className={'flex justify-center p-2 gap-4 mx-auto' + ((props.type === ButtonType.INVERTED || props.type === ButtonType.SECONDARY) ? ' text-primary' : '')}>
                            {props.isWorking ? <Spinner size='sm' color='white'/> : children}
                        </div>
                    </button>
            }
        </>
    )
}