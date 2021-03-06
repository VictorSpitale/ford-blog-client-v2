import {createReducer} from "@reduxjs/toolkit";
import {setError} from "../actions/errors.actions";

export interface ErrorState {
    profileViewError: string;
    securityViewError: string;
    writePageError: string;
}

export type ErrorStateType = {
    key: keyof ErrorState;
    error: string
}

const initial: ErrorState = {
    profileViewError: '',
    securityViewError: '',
    writePageError: ''
}

export const errorsReducer = createReducer(initial, (builder => {
    builder.addCase(setError, (state, {payload}) => {
        state[payload.key] = payload.error;
    })
}));

export default errorsReducer;