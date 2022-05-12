import { useState} from 'react';

export default function TextOptionList({ options, addOption, removeOption, placeholder, inputValue, setInputValue, noResponsesMsg }) {
    const [ error, setError ] = useState(null);
    const className='textOption';

    const addNewOption = (option) => {
        if (!option) {
            setError('The value cannot be blank');
            return;
        }

        if (options.map(option => option.toLowerCase()).includes(option.toLowerCase())) {
            setError('This value already exists');
            return;
        }

        setError(null);
        addOption(option);
    }

    const parsedOptions = options.map(option => 
        <div key={option} className={`${className} optionContainer`}>
            <p>{option}</p>
            <img src='https://i.robertify.me/images/mwafd.png' alt='Remove Option' onClick={() => { setError(null); removeOption(option) }}/>
        </div>
    )

    return (
        <div className={className}>
            <div className={`${className} optionsContainer`}>
                {parsedOptions.length ? parsedOptions : <p className={`${className} noResponses`}>{noResponsesMsg}</p>}
            </div>
            <div className={`${className} optionSubmitters`}>
                <input type='text' placeholder={placeholder} value={inputValue} onChange={(event) => { setError(null); setInputValue(event.target.value) }} />
                <img src='https://i.robertify.me/images/t7mco.png' alt='Add Option' onClick={() => { setError(null); addNewOption(inputValue) }} />
            </div>
            { error && <p className={`${className} error`}>{`Error: ${error}`}</p> }
        </div>
    )
}