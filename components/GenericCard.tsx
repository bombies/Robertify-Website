import Parser from "html-react-parser";
import Button, {ButtonInfo} from "./Button";

type Props = {
    coverImage?: string,
    title: string,
    titleColor?: string,
    subTitle?: string,
    subTitleColour?: string,
    subTitleToColour?: string,
    subTitleAnimated?: boolean,
    content: string,
    contentImg?: string,
    footer?: string,
    maxHeight?: string
    buttons?: ButtonInfo[]
}

export default function GenericCard(props: Props) {
    const parsedContent = props.content.replaceAll('\\n', '<br/>');
    const content = Parser(parsedContent);
    const subTitleColour = props.subTitleColour.replaceAll('text-', 'from-');
    const subTitleToColour = props.subTitleToColour.replaceAll('text-', 'to-');

    const buttons = props.buttons ? props.buttons.map(button => <Button key={button.id} text={button.text} colour={button.colour} size={button.size} href={button.href} gradientDirection={button.gradientDirection} toColour={button.toColour} animatedStyle={button.animatedStyle} />) : []

    return (
        <div className={`w-full bg-neutral-900 p-5 rounded-xl drop-shadow-lg ${props.maxHeight || ''}`}>
            {props.coverImage && <img className='rounded-t-xl drop-shadow-lg w-full h-1/3 object-cover ' src={props.coverImage}/>}
            <h1 className={`mt-6 uppercase font-bold text-3xl ${props.titleColor || ''}`}>{props.title}</h1>
            {props.subTitle && <h3 className={`mt-2 font-med text-xl ${props.subTitleAnimated ? `text-transparent bg-clip-text bg-gradient-to-l ${subTitleColour} ${subTitleToColour} animate-text-fast` : props.subTitleToColour ? `text-transparent bg-clip-text bg-gradient-to-br from-${props.subTitleColour.replace('text-', '')} ${props.subTitleToColour}` : props.subTitleColour ? props.subTitleColour : 'text-neutral-400' }`} >{props.subTitle}</h3>}
            <p className='mt-3 overflow-x-auto text-ellipsis overflow-ellipsis h-1/4'>{content}</p>
            {props.contentImg && <img className='rounded-xl mt-6 drop-shadow-lg' src={props.contentImg} />}
            <div className='flex justify-center gap-2 place-content-center mt-14' >
                {buttons}
            </div>
            {props.footer && <p className='pt-4 text-sm text-neutral-500'>{props.footer}</p>}
        </div>
    )
}