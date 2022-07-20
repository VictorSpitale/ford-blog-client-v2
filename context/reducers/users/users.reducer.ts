import {IUser} from "../../../shared/types/user.type";
import {createReducer} from "@reduxjs/toolkit";
import {getUsers} from "../../actions/users/users.actions";
import {getUserById} from "../../actions/admin/admin.actions";

export type UsersState = {
    users: IUser[];
    allFetched: boolean;
    pending: boolean;
    error: boolean
}
const initial: UsersState = {
    users: [],
    allFetched: false,
    pending: false,
    error: false
}

export const usersReducer = createReducer(initial, (builder => {
    builder.addCase(getUsers.pending, (state) => {
        state.pending = true;
    }).addCase(getUsers.fulfilled, (state, {payload}) => {
        state.users = payload
        state.allFetched = true;
        state.pending = false;
    }).addCase(getUsers.rejected, (state) => {
        state.pending = false;
    }).addCase(getUserById.pending, (state) => {
        state.pending = true;
    }).addCase(getUserById.fulfilled, (state, {payload}) => {
        state.pending = false;
        const found = state.users.find((u) => u._id === payload._id);
        if (found) {
            state.users.map((u) => {
                if (u._id === payload._id) return payload;
                return u;
            })
        } else {
            state.users = [
                ...state.users,
                payload
            ]
        }
    }).addCase(getUserById.rejected, (state) => {
        state.pending = false;
    })
}))

export default usersReducer;