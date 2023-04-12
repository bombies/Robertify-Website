import {Action, combineReducers, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import darkModeReducer from "@/utils/redux/slices/dark-mode-slice";
import {FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {createWrapper} from "next-redux-wrapper";
import dashboardReducer from "@/utils/redux/slices/dashboard-slice";

const createNoopStorage = () => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        },
    };
};

const strg = (typeof window !== 'undefined') ? storage : createNoopStorage();

const persistConfig = {
    key: 'root',
    version: 1,
    storage: strg,
}

const rootReducer = combineReducers({
    darkMode: darkModeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reducers = combineReducers({
    persistedReducer,
    guildDashboard: dashboardReducer
})

export const makeStore = () => {
    return configureStore({
        reducer: reducers,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    })
}

export const store = makeStore();
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const persistor = persistStore(store);
export const storeWrapper = createWrapper(() => store)
export default store;