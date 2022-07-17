import {createAction} from "@reduxjs/toolkit";
import {AdminViews} from "../../shared/types/adminViews.type";

export const SET_VIEW = "SET_VIEW";

export const setView = createAction<AdminViews>(SET_VIEW);