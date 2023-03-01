import React, {PropsWithChildren} from "react";
import {DiscordDataProvider} from "@/app/_components/discord-data-context";
import {DarkModeProvider} from "@/app/_components/dark-mode-context";
import ReduxProvider from "@/app/_components/redux-provider";

type Props = PropsWithChildren;

export default function Providers({children}: Props) {
    return (
        <ReduxProvider>
            <DarkModeProvider>
                <DiscordDataProvider initialDiscordData={undefined}>
                    {children}
                </DiscordDataProvider>
            </DarkModeProvider>
        </ReduxProvider>
    );
}