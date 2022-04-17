import {createAction} from "@reduxjs/toolkit";
import {AccountViews} from "../../shared/types/accountViews.type";

export const SET_VIEW = "SET_VIEW";

export const setView = createAction<AccountViews>(SET_VIEW);