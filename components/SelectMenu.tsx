import { nanoid } from "nanoid";
import { ChangeEvent, useEffect } from "react";
import Image from "next/image";

export default function SelectMenu({ 
        className = 'selectMenu', id, title, subTitle = null, menuOptions, multiSelect = false, placeHolder,
        selectValues, setSelectValues, optionsVisible, setOptionsVisible, searchText, setSearchText,
        isChannelMenu = false, isVoiceMenu = false, isPremium = false, isDisabled = false
    }) {
        
    const search = (event): void => {
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
                        <div className='relative w-4 h-4'>
                            <Image src={isVoiceMenu ? 'https://i.imgur.com/KLccEa8.png' : 'https://i.imgur.com/4g770gD.png'} alt='' fill={true} />
                        </div>
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
                <p className={`${className} title`}>{title} {isPremium && <span className='banner-tiny bg-green pointer-noEvents marin-left-sm font-med'>Premium</span>}</p>
                <p className={`${className} subTitle`}>{subTitle}</p>
            </div>
            <div className={`${className} menu ${isDisabled ? 'cursor-notAllowed' : ''}`} onClick={setOptionsVisible}>
                <p className={`${className} menu-selected ${isDisabled ? 'cursor-notAllowed' : ''}`}>{ !selectValues.length ? placeHolder : selectValues.length === 1 ? selectValues[0].name : `${selectValues.length} options selected` }</p>
                <img className={`${className} dropDown ${isDisabled ? 'cursor-notAllowed' : ''}`} src={`${process.env.NEXT_PUBLIC_HOSTED_IMAGE_SERVER_HOSTNAME}/images/zxqvx.png`} alt='Drop down icon' />
            </div>
            <div id={`${className}-menuOptionsContainer#${id}`} className={`${className} menu-optionsContainer ${optionsVisible ? 'active' : ''} ${isDisabled ? 'cursor-notAllowed' : ''}`}>
                <input className={`${className} menu-options-search`} type='text' placeholder='Search...' value={searchText} onChange={search} />
                <div className={`${className} menu-options`}>
                    {options}
                </div>
            </div>
        </div>
    )
}