'use client';

import toast, {Toast} from "react-hot-toast";
import {StaticImageData} from "next/image";
import GenericImage from "@/app/_components/GenericImage";
import close from '/public/reqchannel/disconnect.svg';
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";

type Props = {
    toastObj: Toast
    data: ToastDataProps
}

export type ToastDataProps = {
    title?: string,
    description: string,
    icon?: string | StaticImageData
    type?: ButtonType
}

export default function ToastComponent(props: Props) {
    const { title, description, icon } = props.data;
    return (
        <div className={`${props.toastObj.visible ? 'animate-enter' : 'animate-leave'} dark:bg-dark/90 rounded-xl bg-neutral-200/75 backdrop-blur-sm p-6 min-w-96 max-w-[32rem] flex gap-4 justify-between`}>
            { icon && <GenericImage className='self-center' src={icon} width={1.5} /> }
            <div className='self-center'>
                {
                    title && <h3 className='text-primary text-xl font-semibold'>{title}</h3>
                }
                <p className='dark:text-white text-black'>{description}</p>
            </div>
            <Button
                className='self-start'
                icon={close}
                width={2}
                height={2}
                onClick={() => {
                    toast.dismiss(props.toastObj.id)
                }}
                type={props.data.type}
            />
        </div>
    )
}