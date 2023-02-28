'use client';

import React, {useState} from "react";

const DarkModeContext = React.createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

export function DarkModeProvider({
    children,
    initialDarkModeState
                                 }: {
    children: React.ReactNode,
    initialDarkModeState: boolean
}) {
    const [ darkMode, setDarkMode ] = useState<boolean>(false);
    const data = initialDarkModeState || darkMode;

    return (
        <DarkModeContext.Provider value={[data, setDarkMode]}>
            <div className={darkMode ? 'dark' : ''}>
                {children}
            </div>
        </DarkModeContext.Provider>
    )
}

export function useDarkMode() {
    const context = React.useContext(DarkModeContext);
    if (!context)
        throw new Error('useDarkMode must be used within a DiscordDataProvider');
    return context;
}