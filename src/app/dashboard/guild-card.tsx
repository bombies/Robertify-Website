import Card from "@/components/card";
import Image from "next/image";

type Props = {
    id: string,
    icon?: string,
    name: string
}

export default function GuildCard(props: Props) {
    return (
        <Card centered size='xs' hoverable className='pointer-cursor h-32 flex flex-col' href={`/dashboard/${props.id}`}>
            <div className='flex justify-between max-h-16 my-auto'>
                <h3 className='text-primary text-xl dark:drop-shadow-glow-primary-lg w-[50%] h-full text-ellipsis overflow-hidden'>{props.name}</h3>
                <div className='relative h-16 phone:h-12 w-16 phone:w-12 rounded-full '>
                    <Image src={props.icon || 'https://i.imgur.com/k14Qfh5.png'} alt='' fill={true} className='rounded-full' />
                </div>
            </div>
        </Card>
    )
}