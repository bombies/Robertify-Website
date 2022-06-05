import Parser from "html-react-parser";

type Props = {
    author?: Author,
    title: string,
    subtitle?: string | undefined,
    content: string,
    contentImg?: string,
}

type Author = {
    name: string,
    avatar: string
}

export default function ArticleBubble(props: Props) {
    const replacedContent = props.content.replaceAll('\\n', '<br/>');
    const content = Parser(replacedContent);

    return (
        <div className='bg-transparent-gray w-5/6 rounded-3xl drop-shadow-xl p-10 mx-auto z-0'>
            {/*Author Div*/}
            { props.author &&
                <div className='flex gap-x-5'>
                    <img className='rounded-full w-16 drop-shadow-lg' src={props.author.avatar} alt={`${props.author.name} Avatar Icon`} />
                    <p className='self-center drop-shadow-lg'>{props.author.name}</p>
                </div>
            }
            {/*Title Div*/}
            <div>
                <p className='drop-shadow-lg uppercase font-bold text-3xl phone:text-xl mt-6'>{props.title}</p>
                {props.subtitle && <p className='drop-shadow-lg font-med text-xl phone:text-lg text-gray-300 mb-6'>{props.subtitle}</p>}
            </div>
            <p className={`${props.subtitle ? '' : 'mt-6'} phone:text-sm`}>{content}</p>
            {props.contentImg && <img loading='lazy' decoding='async' className='rounded-lg drop-shadow-lg mt-6 ease-in-out duration-1000 hover:scale-125 z-10' src={props.contentImg}/>}
        </div>
    )
}