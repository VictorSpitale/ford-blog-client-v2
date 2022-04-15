import {IUser} from "../../shared/types/user.type";
import {createReducer} from "@reduxjs/toolkit";
import {getUser} from "../actions/user.actions";

export type UserState = {
    user: IUser;
    pending: boolean;
    error: boolean
}
const initial: UserState = {
    user: {} as IUser,
    pending: false,
    error: false
}

export const userReducer = createReducer(initial, (builder => {
    builder.addCase(getUser.fulfilled, (state, {payload}) => {
        state.user = payload
    })
}))

export default userReducer;