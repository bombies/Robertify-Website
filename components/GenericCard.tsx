import Parser from "html-react-parser";
import Button, {ButtonInfo} from "./Button";
import Image from "next/image";

type Props = {
    coverImage?: string,
    title: string,
    titleColor?: string,
    subTitle?: string,
    subTitleColour?: string,
    subTitleToColour?: string,
    subTitleAnimated?: boolean,
    content?: string,
    contentList?: string[],
    contentImg?: string,
    footer?: string,
    maxHeight?: string
    buttons?: ButtonInfo[]
}

export default function GenericCard(props: Props) {
    const parsedContent = props.content ? props.content.replaceAll('\\n', '<br/>') : null;
    const content = parsedContent ? Parser(parsedContent) : null;
    const contentList = props.contentList ? props.contentList.map(item => <li key={item} className='marker:text-lime-400 marker:visible'>{item}</li>) : null;

    const buttons = props.buttons ? props.buttons.map(button => <Button key={button.id} text={button.text} colour={button.colour} size={button.size} href={button.href} gradientDirection={button.gradientDirection} toColour={button.toColour} animatedStyle={button.animatedStyle} />) : []

    return (
        <div className={`w-full bg-neutral-900 p-5 rounded-xl drop-shadow-lg ${props.maxHeight || ''}`}>
            {props.coverImage &&
                <div className='relative rounded-t-xl drop-shadow-lg w-full h-1/3'>
                    <Image src={props.coverImage} alt='' layout='fill' objectFit='cover' className='rounded-t-xl' />
                </div>
            }
            <h1 className={`mt-6 uppercase font-bold text-3xl ${props.titleColor || ''}`}>{props.title}</h1>
            {props.subTitle && <h3 className={`mt-2 font-med text-xl ${props.subTitleAnimated ? `text-transparent bg-clip-text bg-gradient-to-l ${props.subTitleColour} ${props.subTitleToColour} animate-text-fast` : props.subTitleToColour ? `text-transparent bg-clip-text bg-gradient-to-br from-${props.subTitleColour.replace('text-', '')} ${props.subTitleToColour}` : props.subTitleColour ? props.subTitleColour : 'text-neutral-400' }`} >{props.subTitle}</h3>}
            {contentList && <ul className='mt-3 overflow-x-auto text-ellipsis text-2xl tablet:text-xl overflow-ellipsis h-1/4'>{contentList}</ul>}
            {content && <p className='mt-3 overflow-x-auto text-ellipsis overflow-ellipsis h-1/4'>{content}</p>}
            {props.contentImg &&
                <div className='relative h-[15rem] rounded-xl mt-6 drop-shadow-lg'>
                    <Image src={props.contentImg} alt='' layout='fill' objectFit='contain' className='rounded-xl' />
                </div>
            }
            <div className='flex justify-center gap-2 place-content-center mt-4' >
                {buttons}
            </div>
            {props.footer && <p className='pt-4 text-sm text-neutral-500'>{props.footer}</p>}
        </div>
    )
}