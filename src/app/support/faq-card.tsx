'use client';

import Card from "@/components/card";
import {useState} from "react";
import {Modal} from "@nextui-org/react";
import Image from "next/image";
import Parser from "html-react-parser";
import {useDarkMode} from "@/app/_components/dark-mode-context";

type Props = {
    title: string;
    content: string;
    contentImg?: string;
}

export default function FAQCard(props: Props) {
    const [expanded, setExpanded] = useState(false);
    const [darkMode] = useDarkMode();
    const closeCard = () => {
        setExpanded(false);
    }

    return (
        <div>
            <Card
                onClick={() => setExpanded(true)}
                className='!w-full pointer-cursor'
                hoverable
                title={props.title}
                size='xs'
            />
            <Modal
                blur
                color='primary'
                closeButton
                aria-labelledby="modal-title"
                open={expanded}
                onClose={closeCard}
                css={{
                    backgroundColor: '$background'
                }}
            >
                <Modal.Header>
                    <p id='modal-title' className='text-xl'>
                        {props.title}
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-lg'>{Parser(props.content.replaceAll('\\n', '<br/>'))}</p>
                    {props.contentImg &&
                        <div className='relative w-80 h-80'>
                            <Image
                                src={props.contentImg}
                                alt=''
                                fill={true}
                                style={{
                                    objectFit: 'scale-down'
                                }}
                                sizes='20rem'
                            />
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </div>

    )
}