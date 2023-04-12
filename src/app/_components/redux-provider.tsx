"use client";

import {PropsWithChildren} from "react";
import {Provider} from "react-redux";
import store, {persistor} from "@/utils/redux/redux-store";
import {PersistGate} from "redux-persist/integration/react";

const ReduxProvider = ({children}: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                {children}
            </PersistGate>
        </Provider>
    );
}

export default ReduxProvider