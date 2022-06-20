import {MouseEventHandler} from "react";
import Image from "next/image";

type Props = {
    text: string,
    icon?: string,
    isDisabled?: boolean,
    isSelected?: boolean
    onClick?: MouseEventHandler<HTMLDivElement>
}

export default function SelectCard(props: Props) {
    return (
        <div onClick={props.onClick} className={`flex bg-neutral-900 rounded-xl overflow-hidden overflow-ellipsis cursor-pointer transition-fast hover:scale-105 border-[1px] ${props.isSelected ? 'border-lime-400' : 'border-neutral-800' } hover:border-lime-300  drop-shadow-lg`}>
            {props.icon &&
                <div className='relative w-16 h-16'>
                    <Image src={props.icon} alt='' layout='fill' objectFit='cover' />
                </div>
            }
            <h1 className='text-center self-center mx-auto max-w-[10rem] whitespace-nowrap overflow-hidden overflow-ellipsis pointer-events-none px-2'>{props.text}</h1>
            {props.isDisabled || <div className={`w-3 h-3 border-[1px] border-lime-400 ${props.isSelected ? 'bg-lime-400' :  ''} rounded-full self-center mr-2 transition-fast`}></div>}

        </div>
    )
}