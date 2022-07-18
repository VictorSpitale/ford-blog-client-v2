import {IUser} from "../../shared/types/user.type";
import {createReducer} from "@reduxjs/toolkit";
import {getUsers} from "../actions/users.actions";

export type UsersState = {
    users: IUser[];
    pending: boolean;
    error: boolean
}
const initial: UsersState = {
    users: [],
    pending: false,
    error: false
}

export const usersReducer = createReducer(initial, (builder => {
    builder.addCase(getUsers.pending, (state) => {
        state.pending = true;
    }).addCase(getUsers.fulfilled, (state, {payload}) => {
        state.users = payload
        state.pending = false;
    }).addCase(getUsers.rejected, (state) => {
        state.pending = false;
    })
}))

export default usersReducer;