import {createAction} from "@reduxjs/toolkit";
import {ErrorState} from "../reducers/errors.reducer";

export const SET_ERROR = "SET_ERROR";

export const setError = createAction<{ key: keyof ErrorState, error: string }>(SET_ERROR);