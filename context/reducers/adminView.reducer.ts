import {createReducer} from "@reduxjs/toolkit";
import {AdminViews} from "../../shared/types/adminViews.type";
import {setAdminView} from "../actions/admin.actions";

export type AdmAdminViews = {
    view: AdminViews;
}
const initial: AdmAdminViews = {
    view: AdminViews.POSTS,
}

export const adminViewReducer = createReducer(initial, (builder => {
    builder.addCase(setAdminView, (state, {payload}) => {
        state.view = payload;
    })
}))

export default adminViewReducer;