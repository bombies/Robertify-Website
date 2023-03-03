'use client';

import React, {useState} from "react";

const DadJokeContext = React.createContext<[string, React.Dispatch<React.SetStateAction<null | string>>] | undefined>(undefined);

export function DadJokeProvider({
    children,
    initialDadJoke
                                }: {
    children: React.ReactNode,
    initialDadJoke: string
}) {
    const [ dadJoke, setDadJoke ] = useState<null | string>(null);
    const joke = dadJoke || initialDadJoke;

    return (
        <DadJokeContext.Provider value={[joke, setDadJoke]}>
            {children}
        </DadJokeContext.Provider>
    )
}

export function useDadJoke() {
    const context = React.useContext(DadJokeContext);
    if (context === undefined)
        throw new Error('useDaDJoke must be used within a DadJokeProvider!');
    return context;
}