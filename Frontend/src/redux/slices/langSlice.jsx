import { createSlice } from "@reduxjs/toolkit";
import en from "../../locales/en";
import ar from "../../locales/ar";


 const langSlice =createSlice({
    name: 'handleLang',
    initialState: {
        lang: "en",
        content: en
    },
    reducers: {
       toggleLang: (state) => {
            if(state.lang === "en"){
                state.lang = "ar"
                state.content = ar

            }else{
                state.lang = "en"
                state.content = en
            }
        },
    },
});

export const { toggleLang } = langSlice.actions;
export default langSlice.reducer;