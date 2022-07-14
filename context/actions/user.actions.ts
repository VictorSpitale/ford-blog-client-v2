import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IUser, UpdateUser} from "../../shared/types/user.type";
import {RootState} from "../store";
import {isEmpty} from "../../shared/utils/object.utils";
import {fetchApi} from "../instance";
import {AnyFunction} from "../../shared/types/props.type";

export const GET_USER = "GET_USER";
export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";
export const UPDATE_LOGGED_USER = "UPDATE_LOGGED_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const REMOVE_PICTURE = "REMOVE_PICTURE";
export const DELETE_ACCOUNT = "DELETE_ACCOUNT";

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

export const updateLoggedUser = createAsyncThunk<IUser, UpdateUser & { _id: string }, { state: RootState }>(UPDATE_LOGGED_USER, async (user, {rejectWithValue}) => {
    let response = {} as IUser;
    return await fetchApi('/api/users/{id}', {
        method: "patch",
        params: {id: user._id},
        json: {password: user.password, pseudo: user.pseudo, currentPassword: user.currentPassword}
    }).then((res) => {
        response = res.data as IUser;
        return response;
    }).catch((res) => {
        return rejectWithValue(res);
    })
})

export const uploadPicture = createAsyncThunk<string, { _id: string; data: FormData }, { state: RootState }>(UPLOAD_PICTURE, async (data) => {
    let response = "";
    await fetchApi("/api/users/upload/{id}", {method: "patch", params: {id: data._id}, data: data.data}).then((res) => {
        response = res.data.picture
    })
    return response;
})

export const removePicture = createAsyncThunk<void, string, { state: RootState }>(REMOVE_PICTURE, async (id) => {
    await fetchApi("/api/users/upload/{id}", {method: "delete", params: {id}});
})

export const deleteAccount = createAsyncThunk<void, string, { state: RootState }>(DELETE_ACCOUNT, async (id) => {
    await fetchApi("/api/users/{id}", {method: "delete", params: {id}});
})