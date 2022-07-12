import {createAction} from "@reduxjs/toolkit";
import {ErrorStateType} from "../reducers/errors.reducer";

export const SET_ERROR = "SET_ERROR";

export const setError = createAction<ErrorStateType>(SET_ERROR);