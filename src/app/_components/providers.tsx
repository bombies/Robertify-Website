'use client';

import React, {PropsWithChildren} from "react";
import {DiscordDataProvider} from "@/app/_components/discord-data-context";
import {DarkModeProvider} from "@/app/_components/dark-mode-context";
import ReduxProvider from "@/app/_components/redux-provider";
import {useServerInsertedHTML} from "next/navigation";
import {CssBaseline, NextUIProvider} from "@nextui-org/react";
import {SSRProvider} from "@react-aria/ssr";
import darkTheme from "@/utils/ui/themes/default-dark";
import {ThemeProvider} from "next-themes";
import lightTheme from "@/utils/ui/themes/default-light";

type Props = PropsWithChildren;

export default function Providers({children}: Props) {
    useServerInsertedHTML(() => {
        return <>{CssBaseline.flush()}</>;
    })


    return (
        <SSRProvider>
            <ReduxProvider>
                <ThemeProvider
                    defaultTheme="system"
                    attribute='class'
                    value={{
                        light: lightTheme.className,
                        dark: darkTheme.className,
                    }}
                >
                    <NextUIProvider>
                        <DarkModeProvider>
                            <DiscordDataProvider initialDiscordData={undefined}>
                                {children}
                            </DiscordDataProvider>
                        </DarkModeProvider>
                    </NextUIProvider>
                </ThemeProvider>
            </ReduxProvider>
        </SSRProvider>
    );
}