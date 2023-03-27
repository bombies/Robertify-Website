'use client';

import Card from "@/components/card";
import {useState} from "react";
import {Modal} from "@nextui-org/react";
import GenericImage from "@/app/_components/GenericImage";
import Parser from 'html-react-parser';

type Props = {
    title: string;
    content: string;
    contentImg?: string;
}

export default function FAQCard(props: Props) {
    const [expanded, setExpanded] = useState(false);
    const closeCard = () => {
        setExpanded(false);
    }

    return (
        <div>
            <Card
                onClick={() => setExpanded(true)}
                className='!w-full pointer-cursor h-full'
                hoverable
                title={props.title}
                size='xs'
            />
            <Modal
                blur
                color='primary'
                closeButton
                aria-labelledby="modal-title"
                className='overflow-visible'
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
                <Modal.Body className='overflow-visible'>
                    <p className='text-lg'>{Parser(props.content.replaceAll('\\n', '<br/>'))}</p>
                    {props.contentImg &&
                        <GenericImage
                            className='hover:scale-[200%] transition-fast'
                            width={20}
                            src={props.contentImg}
                            style={{
                                objectFit: 'scale-down'
                            }}
                        />
                    }
                </Modal.Body>
            </Modal>
        </div>

    )
}