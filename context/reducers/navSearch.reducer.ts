import {createReducer} from "@reduxjs/toolkit";
import {setQuery} from "../actions/navSearch.actions";

export type NavSearchReducer = {
    query: string;
}

const initial: NavSearchReducer = {
    query: '',
}

export const navSearchReducer = createReducer(initial, (builder) => {
    builder
        .addCase(setQuery, (state, {payload}) => {
            state.query = payload.query;
        })
});
