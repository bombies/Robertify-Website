'use client';

import React from "react";
import {DarkModeProvider} from "@/app/_components/dark-mode-context";
import ReduxProvider from "@/app/_components/redux-provider";
import {useServerInsertedHTML} from "next/navigation";
import {CssBaseline, NextUIProvider} from "@nextui-org/react";
import {SSRProvider} from "@react-aria/ssr";
import darkTheme from "@/utils/ui/themes/default-dark";
import lightTheme from "@/utils/ui/themes/default-light";
import {ThemeProvider} from "next-themes";
import {SessionProvider} from "next-auth/react";

interface Props extends React.PropsWithChildren {
    session: any
}

export default function Providers({children, session}: Props) {
    useServerInsertedHTML(() => {
        return <>{CssBaseline.flush()}</>;
    })


    return (
        <body>
        <SSRProvider>
            <ReduxProvider>
                <ThemeProvider
                    defaultTheme="dark"
                    attribute='class'
                    value={{
                        light: lightTheme.className,
                        dark: darkTheme.className,
                    }}
                >
                    <NextUIProvider>
                        <DarkModeProvider>
                            <SessionProvider session={session}>
                                {children}
                            </SessionProvider>
                        </DarkModeProvider>
                    </NextUIProvider>
                </ThemeProvider>
            </ReduxProvider>
        </SSRProvider>
        </body>
    );
}