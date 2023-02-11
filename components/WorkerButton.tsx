import {MouseEventHandler} from "react";
import {Spinner} from "flowbite-react";
import Image from "next/image";

type Props = {
    text: string,
    colour: string,
    width?: string,
    height?: string,
    onClick?: MouseEventHandler<HTMLDivElement>,
    isWorking?: boolean,
    icon?: string,
    isDisabled?: boolean
}

export default function WorkerButton(props: Props) {
    return (
        <div onClick={props.isDisabled === true ? () => {} : props.onClick} className={`${props.isDisabled === true ? 'cursor-not-allowed brightness-50' : ''} flex justify-center cursor-pointer transition-fast hover:scale-105 drop-shadow-lg rounded-2xl ${props.colour} ${props.width ? `w-[${props.width}rem]` : 'w-32'} ${props.height ? `h-[${props.height}rem]` : 'h-16'}`}>
            {props.isWorking ?
                <div className='self-center'>
                    <div className='relative w-6 h-6 animate-spin'>
                        <Image src={`${process.env.NEXT_PUBLIC_HOSTED_IMAGE_SERVER_HOSTNAME}/images/b4t1n.png`} alt='' fill={true} />
                    </div>
                </div>
                :
                <div className='flex gap-2'>
                    {props.icon &&
                        <div className='relative w-6 h-6 self-center'>
                            <Image src={props.icon} alt='' fill={true}/>
                        </div>
                    }
                    <p className='self-center text-xl'>{props.text}</p>
                </div>

            }
        </div>
    )
}