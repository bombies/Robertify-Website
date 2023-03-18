'use client';

import React, {useEffect, useRef, useState} from "react";
import {ComponentSize} from "@/components/card";
import Image, {StaticImageData} from "next/image";
import dropDownIcon from '/public/drop-down.svg';

export type SelectMenuContent = {
    label: string,
    value: string,
    icon?: string | StaticImageData,
    category?: string,
    selected?: boolean,
}

interface Props {
    content?: SelectMenuContent[],
    placeholder?: string,
    size?: ComponentSize,
    multiSelect?: boolean,
    displayCategories?: boolean
    noDeselect?: boolean,
    onItemSelect?: (item: SelectMenuContent) => void;
    handleItemSelect?: (item: SelectMenuContent) => void;
    handleItemDeselect?: (item: SelectMenuContent) => void;
    disabled?: boolean;
}

const parseMenuSize = (size?: ComponentSize) => {
    switch (size) {
        case 'xs':
            return 'w-[15rem] tablet:w-[10rem]';
        case 'sm':
            return 'w-[20rem] tablet:w-[15rem]';
        case 'md':
            return 'w-[25rem] tablet:w-[20rem]';
        case 'lg':
            return 'w-[30rem] tablet:w-[25rem]';
        case 'xl':
            return 'w-[40rem] tablet:w-[35rem] phone:w-[30rem]';
        default:
            return 'w-[15rem] tablet:w-[10rem]';
    }
}

const parseCategories = (content?: SelectMenuContent[]): { category?: string, items: SelectMenuContent[] }[] => {
    if (!content)
        return [];

    const categories = content.map(item => item.category)
        .filter((val, i, arr) => arr.indexOf(val) === i);
    return categories.map(category => {
        return {
            category: category,
            items: content.filter(item => item.category === category)
        }
    })
}

const generateCategoryElement = (
    content: { category?: string, items: SelectMenuContent[] },
    handleSelect: (val: SelectMenuContent) => void, selectedItems?: SelectMenuContent[],
    displayCategories?: boolean,
    onItemSelect?: (item: SelectMenuContent) => void
) => {
    const isItemSelected = (item: SelectMenuContent) => {
        if (item.selected === true) return true;
        return selectedItems ?  selectedItems.includes(item) : false;
    }

    const itemElements = content.items.map(item => (
        <div
            key={`${content.category}#${item.label}#${item.value}`}
            className='flex gap-4 cursor-pointer'
            onClick={() => {
                handleSelect(item);
                if (onItemSelect)
                    onItemSelect(item);
            }}
        >
            {
                item.icon &&
                <div className='relative w-4 h-4 self-center'>
                    <Image draggable={false} src={item.icon} alt='' fill={true}/>
                </div>
            }
            <p className={'dark:text-neutral-400 text-neutral-700 hover:!text-primary transition-fast select-none whitespace-nowrap overflow-hidden text-ellipsis' + (isItemSelected(item) ? ' !text-primary' : '')}>{item.label}</p>
        </div>
    ))

    return (
        <div>
            { displayCategories !== false && <h4 className='dark:text-neutral-600 text-neutral-700 text-center uppercase font-semibold text-sm my-3 select-none whitespace-nowrap overflow-hidden text-ellipsis'>{content.category || 'No Category'}</h4>}
            {itemElements}
        </div>
    )
}

export default function SelectMenu(props: Props) {
    const [expanded, setExpanded] = useState(false);
    const [selected, setSelected] = useState<SelectMenuContent[] | undefined>(props.content?.filter(item => item.selected === true));
    const [ searchValue, setSearchValue ] = useState('');
    const [ visibleItems, setVisibleItems ] = useState(parseCategories(props.content));

    useEffect(() => {
        setSelected(props.content?.filter(item => item.selected === true))
    }, [props.content])

    useEffect(() => {
        setVisibleItems(parseCategories(props.content?.filter(item => item.label.toLowerCase().includes(searchValue))))
    }, [searchValue])

    const toggleExpanded = () => {
        if (props.disabled)
            return;
        setExpanded(prev => !prev);
    }
    const handleSelect = (value: SelectMenuContent) => {
        if (props.disabled)
            return;

        setSelected(prev => {
            if (!prev || prev.length === 0) {
                if (props.handleItemSelect)
                    props.handleItemSelect(value);
                return [value];
            }

            if (typeof props.multiSelect !== 'undefined' && prev.filter(item => item.value === value.value).length > 0) {
                if (props.handleItemDeselect)
                    props.handleItemDeselect(value)
                return prev.filter(item => item.value !== value.value);
            } else if (typeof props.multiSelect !== 'undefined') {
                if (props.handleItemSelect)
                    props.handleItemSelect(value);
                return [...prev, value];
            } else {
                if (typeof props.noDeselect !== 'undefined' && value === prev[0])
                    return [prev[0]];

                if (props.handleItemDeselect)
                    props.handleItemDeselect(prev[0])
                if (props.handleItemSelect)
                    props.handleItemSelect(value);
                return [value]
            }
        })
    }
    const categories = visibleItems.map(category => generateCategoryElement(category, handleSelect, selected, props.displayCategories))

    const wrapperRef = useRef<any>(null);
    const optionsViewRef = useRef<any>(null);

    useEffect(() => {
        const handle = (event: MouseEvent) => {
            if (wrapperRef.current && (!wrapperRef.current?.contains(event.target) && !optionsViewRef.current?.contains(event.target))) {
                setExpanded(false);
            }
        }

        document.addEventListener('mousedown', handle);
        return () => {
            document.removeEventListener('mousedown', handle);
        }
    }, [wrapperRef, optionsViewRef]);

    return (
        <div
            className={'relative ' + parseMenuSize(props.size)}
        >
            <div
                ref={wrapperRef}
                onClick={toggleExpanded}
                className={'flex justify-between cursor-pointer p-3 bg-neutral-100 dark:bg-dark rounded-xl shadow-md' + (props.disabled ? ' brightness-50' : '')}
            >
                <p unselectable='on'
                   className='text-neutral-700 select-none whitespace-nowrap overflow-hidden text-ellipsis'
                >
                    {selected ? ( selected.length > 0 ? selected.map(item => item.label).toLocaleString() : (props.placeholder || '') ) : (props.placeholder || '')}
                </p>
                <div
                    className={'self-center relative w-6 h-6 transition-fast select-none ' + (expanded ? 'rotate-180' : '')}>
                    <Image draggable={false} src={dropDownIcon} alt='' fill={true}/>
                </div>
            </div>
            {
                expanded &&
                <div
                    className='absolute z-50 left-0 mt-4'
                    ref={optionsViewRef}
                >
                    <input type='text'
                           className='p-3 w-full rounded-xl mb-2 bg-neutral-200 dark:bg-dark dark:placeholder-neutral-700 dark:text-white'
                           placeholder='Search...'
                           value={searchValue}
                            onChange={e => {
                                setSearchValue(e.target.value);
                            }}
                    />
                    <div className={' max-h-48 overflow-auto p-4 bg-neutral-200 dark:bg-dark rounded-xl shadow-md transition-faster ' + parseMenuSize(props.size)}>
                        {categories.length !== 0 ? categories :
                            <p className='text-neutral-700 select-none'>There are no items...</p>}
                    </div>
                </div>

            }
        </div>
    )
}