import {createReducer} from "@reduxjs/toolkit";
import {AdminViews} from "../../../shared/types/adminViews.type";
import {setAdminView} from "../../actions/admin/admin.actions";

export type AdminViewsState = {
    view: AdminViews;
}
const initial: AdminViewsState = {
    view: AdminViews.POSTS,
}

export const adminViewReducer = createReducer(initial, (builder => {
    builder.addCase(setAdminView, (state, {payload}) => {
        state.view = payload;
    })
}))

export default adminViewReducer;