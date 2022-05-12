import { nanoid } from "nanoid";
import { useState } from "react"

export default function SelectMenu({ 
        className = 'selectMenu', title, subTitle = null, menuOptions, multiSelect = false, placeHolder,
        selectValues, setSelectValues, optionsVisible, setOptionsVisible, searchText, setSearchText  
    }) {
        
    const search = (event) => {
        const { value } = event.target;
        setSearchText(value);
    }

    const onSelect = (selectValue) => {
        if (multiSelect) {
            setSelectValues(oldSelectedValues => {
                if (oldSelectedValues.includes(selectValue))
                    return oldSelectedValues.filter(e => e !== selectValue);
                else return [...oldSelectedValues, selectValue];
            })
        } else setSelectValues([selectValue]);
    }

    const options = menuOptions.map(option =>
        <div className={`${className} option`} onClick={() => setSelectValues(option)}>
            <p>{option}</p>
            {multiSelect && <div key={nanoid(8)} className={`${className} option-checkbox ${selectValues.includes(option) && 'active'}`}></div>}
        </div> 
    )

    return (
        <div className={className}>
            <div className={`${className} menuDesc`}>
                <p className={`${className} title`}>{title}</p>
                <p className={`${className} subTitle`}>{subTitle}</p>
            </div>
            <div className={`${className} menu`} onClick={setOptionsVisible}>
                <p className={`${className} menu-selected`}>{ !selectValues.length ? placeHolder : selectValues.length === 1 ? selectValues[0] : `${selectValues.length} options selected` }</p>
                <img src='https://i.robertify.me/images/zxqvx.png' alt='Drop down icon' />
            </div>
            <div className={`${className} menu-optionsContainer ${optionsVisible && 'active'}`}>
                <input className={`${className} menu-options-search`} type='text' placeholder='Search...' value={searchText} onChange={search} />
                <div className={`${className} menu-options`}>
                    {options}
                </div>
             </div>
            
            
        </div>
    )
}