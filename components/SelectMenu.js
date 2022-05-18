import { nanoid } from "nanoid";
import { useEffect } from "react";

export default function SelectMenu({ 
        className = 'selectMenu', id, title, subTitle = null, menuOptions, multiSelect = false, placeHolder,
        selectValues, setSelectValues, optionsVisible, setOptionsVisible, searchText, setSearchText,
        isChannelMenu = false, isVoiceMenu = false 
    }) {
        
    const search = (event) => {
        const { value } = event.target;
        setSearchText(value);
    }

    useEffect(() => {
        const menu = document.getElementById(`${className}-menuOptionsContainer#${id}`);
        
        const clickFun = (event) => {
            if (!event.target.className.includes(`${className}`) && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        }

        document.addEventListener('click', clickFun);

        return () => document.removeEventListener('click', clickFun);
    }, [])

    const options = !isChannelMenu ? menuOptions.map(option => {
        return <div key={option.id} className={`${className} option ${selectValues.some(obj => obj.id === option.id) && 'active'}`} style={!multiSelect ? { justifyContent: 'normal', gap: '1.5rem' } : {}} onClick={(event) => setSelectValues(event, optionsVisible, option)}>
            {option.icon || false}
            <p>{option.name}</p>
            {multiSelect && <div className={`${className} option-checkbox ${selectValues.some(obj => obj.id === option.id) && 'active'}`}></div>}
        </div> 
    }) : menuOptions.map(obj => {
        const categoryObj = obj[Object.keys(obj)[0]];
        return <div key={Object.keys(obj)[0]} className={`${className} optionCategory`}>
            <h3>{categoryObj.category_name}</h3>
            {
                categoryObj.channels.map(channel =>
                    <div key={channel.id} className={`${className} option ${selectValues.includes(channel) ? 'active' : ''}`} onClick={(event) => setSelectValues(event, optionsVisible, channel)}>
                        <img className='menu-glyph' src={isVoiceMenu ? 'https://i.imgur.com/KLccEa8.png' : 'https://i.imgur.com/4g770gD.png'} />
                        <p>{channel.name}</p>
                        {multiSelect && <div key={nanoid(8)} className={`${className} option-checkbox ${selectValues.includes(channel) ? 'active' : ''}`}></div>}
                    </div>
                )
            }
        </div> 
    });

    return (
        <div className={className}>
            <div className={`${className} menuDesc`}>
                <p className={`${className} title`}>{title}</p>
                <p className={`${className} subTitle`}>{subTitle}</p>
            </div>
            <div className={`${className} menu`} onClick={setOptionsVisible}>
                <p className={`${className} menu-selected`}>{ !selectValues.length ? placeHolder : selectValues.length === 1 ? selectValues[0].name : `${selectValues.length} options selected` }</p>
                <img className={`${className} dropDown`} src='https://i.robertify.me/images/zxqvx.png' alt='Drop down icon' />
            </div>
            <div id={`${className}-menuOptionsContainer#${id}`} className={`${className} menu-optionsContainer ${optionsVisible ? 'active' : ''}`}>
                <input className={`${className} menu-options-search`} type='text' placeholder='Search...' value={searchText} onChange={search} />
                <div className={`${className} menu-options`}>
                    {options}
                </div>
            </div>
        </div>
    )
}