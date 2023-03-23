'use client';

import Image, {StaticImageData} from "next/image";
import {useVisible} from "@/utils/client-utils";
import {useRef} from "react";

type Props = {
    className?: string
    src: string | StaticImageData,
    alt?: string,
    width?: number,
    height?: number,
    priority?: boolean,
    fade?: boolean,
    draggable?: boolean,
}

export default function GenericImage(props: Props) {
    const ref = useRef<any>();
    const isVisible = useVisible(ref);

    return (
        <div
            ref={ref}
            className={`relative ${props.fade !== undefined ? `fade-in-section ${isVisible ? 'is-visible' : ''}` : ''} ${props.className || ''}`}
            style={{
                width: props.width && `${props.width}rem`,
                height: props.width && `${props.height || props.width}rem`,
            }}
        >
            <Image
                priority={props.priority !== undefined}
                draggable={props.draggable !== undefined}
                src={props.src}
                alt={props.alt ?? ''}
                fill={true}
            />
        </div>
    )
}