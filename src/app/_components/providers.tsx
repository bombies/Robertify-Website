'use client';

import React, {Fragment} from "react";
import ReduxProvider from "@/app/_components/redux-provider";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider} from "next-themes";
import {SessionProvider} from "next-auth/react";
import {Toaster} from "react-hot-toast";
import {GoogleAnalytics} from "nextjs-google-analytics";
import {SWRConfig} from "swr";

interface Props extends React.PropsWithChildren {
    session: any
}

export default function Providers({children, session}: Props) {
    return (
        <Fragment>
            <GoogleAnalytics trackPageViews/>
            <SWRConfig
                value={{
                    refreshInterval: 60 * 1000,
                    revalidateOnFocus: false,
                }}
            >
                <ReduxProvider>
                    <NextUIProvider>
                        <ThemeProvider
                            defaultTheme="dark"
                            attribute='class'
                        >
                            <SessionProvider session={session}>
                                <Toaster
                                    position="top-right"
                                    reverseOrder={false}
                                />
                                {children}
                            </SessionProvider>
                        </ThemeProvider>
                    </NextUIProvider>
                </ReduxProvider>
            </SWRConfig>
        </Fragment>
    );
}