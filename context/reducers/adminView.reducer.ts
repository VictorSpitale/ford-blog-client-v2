import {createReducer} from "@reduxjs/toolkit";
import {AdminViews} from "../../shared/types/adminViews.type";
import {setView} from "../actions/admin.actions";

export type AdmAdminViews = {
    view: AdminViews;
}
const initial: AdmAdminViews = {
    view: AdminViews.POSTS,
}

export const adminViewReducer = createReducer(initial, (builder => {
    builder.addCase(setView, (state, {payload}) => {
        state.view = payload;
    })
}))

export default adminViewReducer;