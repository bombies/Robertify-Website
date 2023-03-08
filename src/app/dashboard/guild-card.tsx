import Card from "@/components/card";
import Image from "next/image";

type Props = {
    id: string,
    icon?: string,
    name: string
}

export default function GuildCard(props: Props) {
    return (
        <Card
            centered
            size='xs'
            hoverable
            className='pointer-cursor h-32 !p-0 flex flex-col phone:w-full hover:shadow-primary/10 shadow-primary/0'
            href={`/dashboard/${props.id}`}
            style={{
                backgroundImage: `url(${props.icon || 'https://i.imgur.com/k14Qfh5.png'})`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: 'cover'
            }}
        >
            <div className='rounded-xl w-full h-full dark:bg-dark/90 bg-neutral-200/50 backdrop-blur-md flex justify-between align-middle  p-6'>
                <h3 className='text-primary text-xl font-semibold w-1/2 self-center whitespace-nowrap overflow-hidden overflow-ellipsis'>{props.name}</h3>
                <div className='relative w-16 h-16 rounded-full border-2 border-primary'>
                    <Image src={props.icon || 'https://i.imgur.com/k14Qfh5.png'} alt='' className='rounded-full' fill={true} />
                </div>
            </div>
        </Card>
    )
}