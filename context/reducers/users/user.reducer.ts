import {IUser} from "../../../shared/types/user.type";
import {createReducer} from "@reduxjs/toolkit";
import {
    deleteAccount,
    getUser,
    login,
    logout,
    removePicture,
    sendContactMail,
    updateUser,
    uploadPicture
} from "../../actions/users/user.actions";

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
    builder.addCase(getUser.pending, (state) => {
        state.pending = true;
    }).addCase(getUser.fulfilled, (state, {payload}) => {
        state.user = payload
        state.pending = false;
    }).addCase(getUser.rejected, (state) => {
        state.pending = false;
    }).addCase(logout.fulfilled, (state) => {
        state.user = {} as IUser;
    }).addCase(login, (state, {payload}) => {
        state.user = payload;
    }).addCase(updateUser.pending, (state) => {
        state.pending = true
    }).addCase(updateUser.fulfilled, (state, {payload}) => {
        state.pending = false;
        if (state.user._id === payload._id) {
            state.user = payload;
        }
    }).addCase(updateUser.rejected, (state) => {
        state.pending = false
    }).addCase(uploadPicture.pending, (state) => {
        state.pending = true
    }).addCase(uploadPicture.fulfilled, (state, {payload}) => {
        state.pending = false;
        if (state.user._id === payload._id) {
            state.user.picture = payload.picture;
        }
    }).addCase(uploadPicture.rejected, (state) => {
        state.pending = false
    }).addCase(removePicture.pending, (state) => {
        state.pending = true
    }).addCase(removePicture.fulfilled, (state, {payload}) => {
        state.pending = false;
        if (state.user._id === payload._id) {
            const {picture, ...other} = state.user;
            state.user = other;
        }
    }).addCase(removePicture.rejected, (state) => {
        state.pending = false
    }).addCase(deleteAccount.fulfilled, (state, {payload}) => {
        if (state.user._id === payload._id) {
            state.user = {} as IUser;
        }
        state.pending = false;
    }).addCase(deleteAccount.pending, (state) => {
        state.pending = true;
    }).addCase(deleteAccount.rejected, (state) => {
        state.pending = false;
    }).addCase(sendContactMail.pending, (state) => {
        state.pending = true;
    }).addCase(sendContactMail.fulfilled, (state) => {
        state.pending = false;
    }).addCase(sendContactMail.rejected, (state) => {
        state.pending = false;
    })
}))

export default userReducer;