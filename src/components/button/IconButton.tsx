'use client';

import {StaticImageData} from "next/image";
import GenericImage from "@/app/_components/GenericImage";
import {MouseEventHandler} from "react";
import {ToastDataProps} from "@/components/ToastComponent";
import {sendToast} from "@/utils/client-utils";

type Props = {
    icon: string | StaticImageData
    size?: number
    onClick?: MouseEventHandler<HTMLDivElement>
    toast?: ToastDataProps;
}

export default function IconButton(props: Props) {
    return (
        <GenericImage
            src={props.icon}
            width={props.size ?? 1.25}
            onClick={(e) => {
                e.preventDefault();
                if (props.onClick)
                    props.onClick(e);
                if (props.toast)
                    sendToast(props.toast)
            }}
        />
    )
}