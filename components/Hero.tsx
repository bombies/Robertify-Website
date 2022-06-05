import Link from "next/link";

interface Button {
    name: string,
    href: string,
    isNextButton?: boolean
}

interface ImageButton {
    name: string,
    href: string,
    src: string,
    alt: string
}

interface Props {
    className?: string,
    title: string,
    subTitle?: string,
    buttons?: Button[],
    imageButtons?: ImageButton[]
}

export default function Hero(props: Props) {
    let buttonKey: number = 0, imgButtonKey: number = 0;
    const buttonsObj = props.buttons ? props.buttons.map(button => !button.isNextButton ? <a key={buttonKey++} className='px-6 py-3 bg-green-600 rounded-lg uppercase text-white font-med text-3xl drop-shadow-lg transition-all ease-in-out duration-500 hover:scale-105 hover:bg-green-500 hover:drop-shadow-xl' href={button.href}>{button.name}</a> : <Link  href={button.href}><span className='px-6 py-3 bg-green-600 rounded-lg uppercase text-white font-med text-3xl drop-shadow-lg transition-all ease-in-out duration-500 cursor-pointer hover:scale-105 hover:bg-green-500 hover:drop-shadow-xl'>{button.name}</span></Link>) : '';
    const imageButtonsObj = props.imageButtons ? props.imageButtons.map(button => <a key={imgButtonKey++} className='hero--img-button' href={button.href} target={'_blank'} rel={'noreferrer'}><img className='hero--img-button-img' src={button.src} alt={button.alt} />{button.name}</a>) : ''

    return (
        <div className='hero'>
            <h1 className='uppercase transition-all ease-in-out duration-1000 font-bold text-9xl drop-shadow-2xl hover:text-lime-300'>{props.title}</h1>
            {props.subTitle && <h3 className='max-w-[42.625rem] font-light text-3xl mx-auto mb-6'>{props.subTitle}</h3>}
            <div className='hero--buttons'>{buttonsObj}</div>
            <div className="hero--img-buttons">{imageButtonsObj}</div>
        </div>
    );
}