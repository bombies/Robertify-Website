'use client';

import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/utils/redux/redux-store";
import {selectDarkModeState, setDarkMode} from "@/utils/redux/slices/dark-mode-slice";
import { useTheme as useNextTheme } from 'next-themes'

const DarkModeContext = React.createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

export function DarkModeProvider({
    children
                                 }: {
    children: React.ReactNode
}) {
    const dispatch = useAppDispatch();
    const { setTheme } = useNextTheme()
    const initialDarkModeState = useAppSelector(selectDarkModeState);
    const [ darkMode, setDarkModeState ] = useState<boolean>(initialDarkModeState);

    useEffect(() => {
        dispatch(setDarkMode(darkMode));
        setTheme(darkMode ? 'dark' : 'light')
    }, [darkMode, dispatch, setTheme])

    return (
        <DarkModeContext.Provider value={[darkMode, setDarkModeState]}>
            <body className={`${darkMode ? 'dark !bg-neutral-800' : '!bg-neutral-50'}`}>
                {children}
            </body>
        </DarkModeContext.Provider>
    )
}

export function useDarkMode() {
    const context = React.useContext(DarkModeContext);
    if (!context)
        throw new Error('useDarkMode must be used within a DiscordDataProvider');
    return context;
}