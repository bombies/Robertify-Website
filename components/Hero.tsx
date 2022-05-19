interface Button {
    name: string,
    href: string
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
    imageButons?: ImageButton[]
}

export default function Hero(props: Props) {
    let buttonKey: number = 0, imgButtonKey: number = 0;
    const buttonsObj = props.buttons ? props.buttons.map(button => <a key={buttonKey++} className='hero--button' href={button.href}>{button.name}</a>) : '';
    const imageButtonsObj = props.imageButons ? props.imageButons.map(button => <a key={imgButtonKey++} className='hero--img-button' href={button.href} target={'_blank'} rel={'noreferrer'}><img className='hero--img-button-img' src={button.src} alt={button.alt} />{button.name}</a>) : ''

    return (
        <div className={props.className ?? 'hero'}>
            <h1 className='hero--title'>{props.title}</h1>
            {props.subTitle && <h3 className='hero--subtitle'>{props.subTitle}</h3>}
            <div className='hero--buttons'>{buttonsObj}</div>
            <div className="hero--img-buttons">{imageButtonsObj}</div>
        </div>
    );
}