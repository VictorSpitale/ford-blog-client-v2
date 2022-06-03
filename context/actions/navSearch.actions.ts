import {createAction} from "@reduxjs/toolkit";
import {NavSearchReducer} from "../reducers/navSearch.reducer";

export const QUERY = "QUERY";

export const setQuery = createAction<NavSearchReducer>(QUERY);