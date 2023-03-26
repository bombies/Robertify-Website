'use client';

import {ButtonType} from "@/components/button/ButtonType";
import {getButtonStyle} from "@/components/button/Button";

type Props = {
    content: string,
    type?: ButtonType,
    className?: string,
}

export default function MiniContent(props: Props) {
    return (
        <div className={`rounded-full self-center py-1 px-3 max-w-fit pointer-events-none ${getButtonStyle(props.type)} ${props.className ?? ''}`}>
            <p className='text-white text-xs'>{props.content}</p>
        </div>
    )
}