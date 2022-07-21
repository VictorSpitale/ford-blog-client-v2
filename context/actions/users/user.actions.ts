import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IUser, UpdateUser} from "../../../shared/types/user.type";
import {RootState} from "../../store";
import {isEmpty} from "../../../shared/utils/object.utils";
import {fetchApi} from "../../instance";
import {AnyFunction} from "../../../shared/types/props.type";
import {ContactType} from "../../../shared/types/contact.type";

export const GET_USER = "GET_USER";
export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";
export const UPDATE_LOGGED_USER = "UPDATE_LOGGED_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const REMOVE_PICTURE = "REMOVE_PICTURE";
export const DELETE_ACCOUNT = "DELETE_ACCOUNT";
export const SEND_CONTACT = "SEND_CONTACT";

export const getUser = createAsyncThunk<IUser, AnyFunction | undefined, { state: RootState }>(GET_USER, async (callback, {getState}) => {
    const {user: userState} = getState().user
    if (!isEmpty(userState)) {
        return userState;
    }
    let response: IUser = {} as IUser;
    await fetchApi("/api/auth/jwt", {method: "get"}).then((res) => {
        response = res.data as IUser
        if (callback) callback(response._id)
    })
    return response;
})

export const logout = createAsyncThunk<void, void, { state: RootState }>(LOGOUT, async () => {
    await fetchApi("/api/auth/logout", {method: "get"});
});

export const login = createAction<IUser>(LOGIN)

export const updateUser = createAsyncThunk<IUser, UpdateUser & { _id: string }, { state: RootState }>(UPDATE_LOGGED_USER, async (user, {rejectWithValue}) => {
    let response = {} as IUser;
    return await fetchApi('/api/users/{id}', {
        method: "patch",
        params: {id: user._id},
        json: {password: user.password, pseudo: user.pseudo, currentPassword: user.currentPassword, role: user.role}
    }).then((res) => {
        response = res.data as IUser;
        return response;
    }).catch((res) => {
        return rejectWithValue(res);
    })
})

export const uploadPicture = createAsyncThunk<{ _id: string; picture: string }, { _id: string; data: FormData }, { state: RootState }>(UPLOAD_PICTURE, async (data) => {
    let response = {} as { _id: string; picture: string };
    await fetchApi("/api/users/upload/{id}", {method: "patch", params: {id: data._id}, data: data.data}).then((res) => {
        response = {
            _id: data._id,
            picture: res.data.picture
        }
    })
    return response;
})

export const removePicture = createAsyncThunk<IUser, IUser, { state: RootState }>(REMOVE_PICTURE, async (user) => {
    await fetchApi("/api/users/upload/{id}", {method: "delete", params: {id: user._id}});
    const {picture, ...other} = user;
    return other;
})

export const deleteAccount = createAsyncThunk<IUser, IUser, { state: RootState }>(DELETE_ACCOUNT, async (user) => {
    await fetchApi("/api/users/{id}", {method: "delete", params: {id: user._id}});
    return user;
})

export const sendContactMail = createAsyncThunk<unknown, ContactType>(SEND_CONTACT, async ({
                                                                                               name,
                                                                                               message,
                                                                                               email
                                                                                           }, {rejectWithValue}) => {
    return await fetchApi("/api/mail/contact", {method: "post", json: {email, message, name}}).then(() => {
        return null;
    }).catch((res) => {
        return rejectWithValue(res)
    });
});