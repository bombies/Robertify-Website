import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "@/utils/redux/redux-store";
import {HYDRATE} from "next-redux-wrapper";

export interface DarkModeState {
    value: boolean;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: DarkModeState = {
    value: false,
    status: 'idle'
};

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.value = !state.value;
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export const selectDarkModeState = (state: AppState) => state.darkMode.value;

const darkModeReducer = darkModeSlice.reducer;
export default darkModeReducer;