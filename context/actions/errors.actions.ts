import {createAction} from "@reduxjs/toolkit";

export const CLEAR_ERROR = "CLEAR_ERROR"

export const clearError = createAction(CLEAR_ERROR);