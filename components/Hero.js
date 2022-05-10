export default function Hero({ title, subTitle, buttons, imageButons }) {
    let buttonKey = 0, imgButtonKey = 0;
    const buttonsObj = buttons ? buttons.map(button => <a key={buttonKey++} className='hero--button' href={button.href}>{button.name}</a>) : '';
    const imageButtonsObj = imageButons ? imageButons.map(button => <a key={imgButtonKey++} className='hero--img-button' href={button.href} target={'_blank'} rel={'noreferrer'}><img className='hero--img-button-img' src={button.src} alt={button.alt} />{button.name}</a>) : ''

    return (
        <div className='hero'>
            <h1 className='hero--title'>{title}</h1>
            {subTitle && <h3 className='hero--subtitle'>{subTitle}</h3>}
            <div className='hero--buttons'>{buttonsObj}</div>
            <div className="hero--img-buttons">{imageButtonsObj}</div>
        </div>
    );
}