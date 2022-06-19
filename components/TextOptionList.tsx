import { useState} from 'react';
import Image from "next/image";

interface Props {
    options: string[],
    addOption: (option: string) => void,
    removeOption: (option: string) => void,
    placeholder: string,
    inputValue: string,
    setInputValue: Function,
    noResponsesMsg: string
}

export default function TextOptionList(props: Props) {
    const [ error, setError ] = useState(null);
    const className: string = 'textOption';

    const addNewOption = (option: string): void => {
        if (!option) {
            setError('The value cannot be blank');
            return;
        }

        if (props.options.map(option => option.toLowerCase()).includes(option.toLowerCase())) {
            setError('This value already exists');
            return;
        }

        setError(null);
        props.addOption(option);
    }

    const parsedOptions = props.options.map(option => 
        <div key={option} className={`${className} optionContainer`}>
            <p>{option}</p>
            <img src='https://i.robertify.me/images/mwafd.png' alt='Remove Option' onClick={() => { setError(null); props.removeOption(option) }}/>
        </div>
    )

    return (
        <div className={className}>
            <div className={`${className} optionsContainer`}>
                {parsedOptions.length ? parsedOptions : <p className={`${className} noResponses`}>{props.noResponsesMsg}</p>}
            </div>
            <div className={`${className} optionSubmitters`}>
                <input className='placeholder-neutral-500' type='text' placeholder={props.placeholder} value={props.inputValue} onChange={(event) => { setError(null); props.setInputValue(event.target.value) }} />
                <div onClick={() => { setError(null); addNewOption(props.inputValue) }} className='relative w-8 h-8 self-center'>
                    <Image src='https://i.robertify.me/images/t7mco.png' alt='Add Option' layout='fill' />
                </div>
            </div>
            { error && <p className={`${className} error`}>{`Error: ${error}`}</p> }
        </div>
    )
}