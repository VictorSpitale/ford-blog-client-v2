import {createReducer} from "@reduxjs/toolkit";
import {changeStatus} from "../actions/firstHydrate.actions";

export type FirstHydrateReducer = {
    status: HydrateStatus,
}

export enum HydrateStatus {
    BEFORE,
    FIRST,
    MORE
}

const initial: FirstHydrateReducer = {
    status: HydrateStatus.BEFORE,
}

export const firstHydrateReducer = createReducer(initial, (builder) => {
    builder
        .addCase(changeStatus.fulfilled, (state, {payload}) => {
            state.status = payload
        })
});
