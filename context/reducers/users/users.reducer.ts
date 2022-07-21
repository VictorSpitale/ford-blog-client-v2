import {IUser} from "../../../shared/types/user.type";
import {createReducer} from "@reduxjs/toolkit";
import {getUsers} from "../../actions/users/users.actions";
import {getUserById} from "../../actions/admin/admin.actions";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../actions/users/user.actions";

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
    }).addCase(removePicture.pending, (state) => {
        state.pending = true
    }).addCase(removePicture.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.users = state.users.map((u) => {
            if (u._id === payload._id) return payload;
            return u;
        })
    }).addCase(removePicture.rejected, (state) => {
        state.pending = false
    }).addCase(uploadPicture.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            if (u._id === payload._id) return {...u, picture: payload.picture};
            return u;
        })
    }).addCase(updateUser.pending, (state) => {
        state.pending = true
    }).addCase(updateUser.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.users = state.users.map((u) => {
            if (u._id === payload._id) return payload;
            return u;
        })
    }).addCase(updateUser.rejected, (state) => {
        state.pending = false
    }).addCase(deleteAccount.fulfilled, (state, {payload}) => {
        state.users = state.users.filter((u) => u._id !== payload._id);
        state.pending = false;
    }).addCase(deleteAccount.pending, (state) => {
        state.pending = true;
    }).addCase(deleteAccount.rejected, (state) => {
        state.pending = false;
    })
}))

export default usersReducer;