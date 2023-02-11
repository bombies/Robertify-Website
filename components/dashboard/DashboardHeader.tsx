import {MouseEventHandler} from "react";
import Image from "next/image";

type Props = {
    text: string,
    icon?: string,
    isSelected?: boolean,
    onClick?: MouseEventHandler<HTMLDivElement>
}

export default function DashboardHeader(props: Props) {
    return (
        <div onClick={props.onClick} className={`flex justify-center gap-4 ${props.isSelected ? 'bg-lime-600' : 'bg-neutral-800'} rounded-t-xl w-[10rem] h-[3rem] cursor-pointer border-[1px] border-neutral-800 hover:border-neutral-500 transition-fast`}>
            {
                props.icon &&
                <div className='relative w-8 h-8 self-center rounded-full'>
                    <Image src={props.icon} alt='' fill={true} className='rounded-full' />
                </div>
            }
            <p className='text-center self-center'>{props.text}</p>
        </div>
    )
}