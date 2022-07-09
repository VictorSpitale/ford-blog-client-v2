import {createReducer} from "@reduxjs/toolkit";
import {setError} from "../actions/errors.actions";

export interface ErrorState {
    profileViewError: string;
}

const initial: ErrorState = {
    profileViewError: ''
}

export const errorsReducer = createReducer(initial, (builder => {
    builder.addCase(setError, (state, {payload}) => {
        state[payload.key] = payload.error;
    })
}));

export default errorsReducer;