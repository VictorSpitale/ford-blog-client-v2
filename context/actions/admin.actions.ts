import {createAction} from "@reduxjs/toolkit";
import {AdminViews} from "../../shared/types/adminViews.type";

export const SET_ADMIN_VIEW = "SET_ADMIN_VIEW";

export const setAdminView = createAction<AdminViews>(SET_ADMIN_VIEW);