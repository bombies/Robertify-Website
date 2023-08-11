'use client';

import {StaticImageData} from "next/image";
import GenericImage from "@/app/_components/GenericImage";
import {ToastDataProps} from "@/components/ToastComponent";
import {sendToast} from "@/utils/client-utils";
import {Button, ButtonProps, Tooltip, TooltipProps} from "@nextui-org/react";
import {PressEvent} from "@react-types/shared";
import {useMemo} from "react";

type Props = {
    icon: string | StaticImageData
    size?: number
    onClick?: (e: PressEvent) => void
    toast?: ToastDataProps;
    tooltipProps?: TooltipProps
} & ButtonProps

export default function IconButton({icon, size, onClick, toast, tooltipProps, ...props}: Props) {
    const button = useMemo(() => (
        <Button
            {...props}
            isIconOnly
            variant={props.variant || "light"}
            startContent={<GenericImage
                className='transition-faster hover:scale-105'
                src={icon}
                width={size ?? 1.25}
            />}
            onPress={(e) => {
                if (onClick)
                    onClick(e);
                if (toast)
                    sendToast(toast)
            }}
        />
    ), [icon, onClick, props, size, toast])

    return tooltipProps !== undefined ? (
            <Tooltip {...tooltipProps}>
                {button}
            </Tooltip>
        ) :
        button
}