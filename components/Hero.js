export default function Hero({ title, subTitle, buttons }) {
    const buttonsObj = buttons ? buttons.map(button => <a className='hero--button' href={button.href}>{button.name}</a>) : '';

    return (
        <div className='hero'>
            <h1 className='hero--title'>{title}</h1>
            {subTitle && <h3 className='hero--subtitle'>{subTitle}</h3>}
            <div className='hero--buttons'>{buttonsObj}</div>
        </div>
    );
}