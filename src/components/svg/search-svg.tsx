'use client';

import {SvgContext, SvgProps} from "@/components/svg/svg-context";
import {useDarkMode} from "@/app/_components/dark-mode-context";

export default function SearchIcon(props: SvgProps) {
    const [ darkMode ] = useDarkMode();

    return (
        <SvgContext {...props} >
            <path d="M17 17L21 21" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#323232" strokeWidth="2"/>
        </SvgContext>
    )
}