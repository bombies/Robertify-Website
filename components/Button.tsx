import Link from "next/link";

type Props = {
    id?: string,
    text: string,
    href?: string,
    colour: 'bg-green-500' | 'bg-green-400' | 'bg-lime-400' | string,
    toColour?: string,
    gradientDirection?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl',
    animatedStyle?: boolean
}

export default function Button(props: Props) {
    return (
        <div className='cursor-pointer drop-shadow-lg transition-all duration-500 ease-in-out hover:scale-105'>
            {props.href ?
                <Link href={props.href}>
                    <span className={`${props.animatedStyle === true ? (`animate-button ${props.gradientDirection} ${props.colour} ${props.toColour}`) : props.toColour ? `bg-gradient-to-br from-${props.colour.replace('bg-', '')} ${props.toColour}` : props.colour} ${(props.size ? (props.size === 'sm' ? 'py-3 px-4 rounded-xl' : (props.size === 'md' ? 'py-5 px-6 rounded-xl' : (props.size === 'lg' ? 'py-6 px-7 rounded-2xl' : (props.size === 'xl' ? 'py-7 px-9 rounded-2xl' : (props.size === '2xl' ? 'py-9 px-12 rounded-2xl' : (props.size === '3xl' ? 'py-10 px-16 rounded-2xl' : (props.size === '4xl' ? 'py-11 px-20 rounded-3xl' : (props.size === '5xl' ? 'py-12 px-24 rounded-3xl' : 'py-3 px-4 rounded-xl')))))))) : 'py-3 px-4 rounded-xl')}`}>
                        {props.text}
                    </span>
                </Link> :
                <div>{props.text}</div>
            }
        </div>
    )
}

export type ButtonInfo = Props;