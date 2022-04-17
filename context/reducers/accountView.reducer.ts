import {createReducer} from "@reduxjs/toolkit";
import {AccountViews} from "../../shared/types/accountViews.type";
import {setView} from "../actions/account.actions";

export type AccountViewType = {
    view: AccountViews;
}
const initial: AccountViewType = {
    view: AccountViews.PROFILE,
}

export const accountViewReducer = createReducer(initial, (builder => {
    builder.addCase(setView, (state, {payload}) => {
        state.view = payload;
    })
}))

export default accountViewReducer;