import Parser from "html-react-parser";
import {useState} from "react";
import Image from "next/image";

type Props = {
    author?: Author,
    title: string,
    subtitle?: string | undefined,
    content: string,
    contentImg?: string,
    collapsable?: boolean
}

type Author = {
    name: string,
    avatar: string
}

export default function ArticleBubble(props: Props) {
    const replacedContent = props.content.replaceAll('\\n', '<br/>');
    const content = Parser(replacedContent);

    const [ openState, setOpenState ] = useState(false);
    const [ contentViewState, setContentViewState ] = useState(false);
    
    const toggleOpenState = () => {
        if (!props.collapsable) return;
        setOpenState(oldState => {
            setContentViewState(!oldState);
            return !oldState;
        });
    }
    
    const toggleContentViewState = (val: boolean) => {
        if (!props.collapsable) return;
        if (openState) return;
        setContentViewState(oldState => val);
    }

    return (
        <div onClick={toggleOpenState} onPointerEnter={() => toggleContentViewState(true)} onPointerLeave={() => toggleContentViewState(false)} className={`bg-transparent-gray w-5/6 rounded-3xl drop-shadow-xl p-10 mx-auto z-0 overflow-hidden ease-in-out duration-700 ${props.collapsable ? `${!openState ? 'max-h-40 hover:max-h-52 hover:scale-105' : 'max-h-full'} cursor-pointer` : ''}`}>
            {/*Author Div*/}
            { props.author &&
                <div className='flex gap-x-5'>
                    <div className='relative rounded-full w-16 h-16 drop-shadow-lg'>
                        <Image src={props.author.avatar} alt={`${props.author.name} Avatar Icon`} className='rounded-full drop-shadow-lg' />
                    </div>
                    <p className='self-center drop-shadow-lg'>{props.author.name}</p>
                </div>
            }
            {/*Title Div*/}
            <div>
                <p className='drop-shadow-lg uppercase font-bold text-2xl laptop:text-xl'>{props.title}</p>
                {props.subtitle && <p className='drop-shadow-lg font-med text-xl phone:text-lg text-gray-300 mb-6'>{props.subtitle}</p>}
            </div>
            {/*Content Div*/}
            <div className={`${props.collapsable ? `${contentViewState ? '' : 'opacity-0'} ease-in-out duration-500` : ''}`}>
                <p className={`${props.subtitle ? '' : 'mt-6'} phone:text-sm`}>{content}</p>
                {
                    props.contentImg &&
                    <div className='relative h-[20rem] rounded-lg drop-shadow-lg mt-6 ease-in-out duration-1000 hover:scale-125 z-10'>
                        <Image src={props.contentImg} alt='Article Bubble Content' layout='fill' objectFit='contain' className='rounded-lg' />
                    </div>
                }
            </div>
        </div>
    )
}