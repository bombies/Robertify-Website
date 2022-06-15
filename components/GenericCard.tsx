import Parser from "html-react-parser";
import Button, {ButtonInfo} from "./Button";
import {FUNDING, PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";

type PaypalButton = {
    createOrder: any,
    onApprove: any
}

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
    paypalButton?: PaypalButton
}

export default function GenericCard(props: Props) {
    const parsedContent = props.content ? props.content.replaceAll('\\n', '<br/>') : null;
    const content = parsedContent ? Parser(parsedContent) : null;
    const contentList = props.contentList ? props.contentList.map(item => <li key={item} className='marker:text-lime-400 marker:visible'>{item}</li>) : null;

    const buttons = props.buttons ? props.buttons.map(button => <Button key={button.id} text={button.text} colour={button.colour} size={button.size} href={button.href} gradientDirection={button.gradientDirection} toColour={button.toColour} animatedStyle={button.animatedStyle} />) : []
    const paypalButton = props.paypalButton ? <PayPalScriptProvider options={{
        'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
        currency: 'USD'
    }} >
        <PayPalButtons
            style={{
                color: 'white',
                shape: 'pill',
                label: 'pay',
                height: 50
            }}
            fundingSource={FUNDING.PAYPAL}
            createOrder={props.paypalButton.createOrder}
            onApprove={props.paypalButton.onApprove}
        />
    </PayPalScriptProvider>
        : null;
    return (
        <div className={`w-full bg-neutral-900 p-5 rounded-xl drop-shadow-lg ${props.maxHeight || ''}`}>
            {props.coverImage && <img className='rounded-t-xl drop-shadow-lg w-full h-1/3 object-cover ' src={props.coverImage}/>}
            <h1 className={`mt-6 uppercase font-bold text-3xl ${props.titleColor || ''}`}>{props.title}</h1>
            {props.subTitle && <h3 className={`mt-2 font-med text-xl ${props.subTitleAnimated ? `text-transparent bg-clip-text bg-gradient-to-l ${props.subTitleColour} ${props.subTitleToColour} animate-text-fast` : props.subTitleToColour ? `text-transparent bg-clip-text bg-gradient-to-br from-${props.subTitleColour.replace('text-', '')} ${props.subTitleToColour}` : props.subTitleColour ? props.subTitleColour : 'text-neutral-400' }`} >{props.subTitle}</h3>}
            {contentList && <ul className='mt-3 overflow-x-auto text-ellipsis text-2xl tablet:text-xl overflow-ellipsis h-1/4'>{contentList}</ul>}
            {content && <p className='mt-3 overflow-x-auto text-ellipsis overflow-ellipsis h-1/4'>{content}</p>}
            {props.contentImg && <img className='rounded-xl mt-6 drop-shadow-lg' src={props.contentImg} />}
            <div className='flex justify-center gap-2 place-content-center' >
                {buttons}
                {paypalButton}
            </div>
            {props.footer && <p className='pt-4 text-sm text-neutral-500'>{props.footer}</p>}
        </div>
    )
}