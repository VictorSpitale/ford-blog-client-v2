import {IUser} from "../../shared/types/user.type";
import {createReducer} from "@reduxjs/toolkit";
import {getUser, login, logout, removePicture, updateLoggedUser, uploadPicture} from "../actions/user.actions";

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
    }).addCase(logout.fulfilled, (state) => {
        state.user = {} as IUser;
    }).addCase(login, (state, {payload}) => {
        state.user = payload;
    }).addCase(updateLoggedUser.pending, (state) => {
        state.pending = true
    }).addCase(updateLoggedUser.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.user = payload;
    }).addCase(updateLoggedUser.rejected, (state) => {
        state.pending = false
    }).addCase(uploadPicture.pending, (state) => {
        state.pending = true
    }).addCase(uploadPicture.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.user.picture = payload;
    }).addCase(uploadPicture.rejected, (state) => {
        state.pending = false
    }).addCase(removePicture.pending, (state) => {
        state.pending = true
    }).addCase(removePicture.fulfilled, (state) => {
        state.pending = false;
        const {picture, ...other} = state.user;
        state.user = other;
    }).addCase(removePicture.rejected, (state) => {
        state.pending = false
    })
}))

export default userReducer;