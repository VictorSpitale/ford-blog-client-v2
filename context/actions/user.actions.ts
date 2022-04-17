import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IUser, UpdateUser} from "../../shared/types/user.type";
import {RootState} from "../store";
import {isEmpty} from "../../shared/utils/object.utils";
import {instance} from "../instance";
import {AnyFunction} from "../../shared/types/props.type";

export const GET_USER = "GET_USER";
export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";
export const UPDATE_LOGGED_USER = "UPDATE_LOGGED_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const REMOVE_PICTURE = "REMOVE_PICTURE";

export const getUser = createAsyncThunk<IUser, AnyFunction, { state: RootState }>(GET_USER, async (callback, {getState}) => {
    const {user: userState} = getState().user
    if (!isEmpty(userState)) {
        return userState;
    }
    let response: IUser = {} as IUser;
    await instance.get('/auth/jwt').then(res => {
        response = res.data;
        callback(response._id);
    });
    return response;
})

export const logout = createAsyncThunk<void, void, { state: RootState }>(LOGOUT, async () => {
    await instance.get("/auth/logout");
});

export const login = createAction<IUser>(LOGIN)

export const updateLoggedUser = createAsyncThunk<IUser, UpdateUser & { _id: string }, { state: RootState }>(UPDATE_LOGGED_USER, async (user, {rejectWithValue}) => {
    let response = {} as IUser;
    return await instance.patch(`/users/${user._id}`, user).then((res) => {
        response = res.data;
        return response;
    }).catch((res) => {
        return rejectWithValue(res.response.data);
    });
})

export const uploadPicture = createAsyncThunk<string, { _id: string; data: FormData }, { state: RootState }>(UPLOAD_PICTURE, async (data) => {
    let response = "";
    await instance.patch(`/users/upload/${data._id}`, data.data).then((res) => {
        response = res.data.picture;
    })
    return response;
})

export const removePicture = createAsyncThunk<void, string, { state: RootState }>(REMOVE_PICTURE, async (id) => {
    await instance.delete(`/users/upload/${id}`);
})