import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IUser} from "../../shared/types/user.type";
import {RootState} from "../store";
import {isEmpty} from "../../shared/utils/object.utils";
import {instance} from "../instance";
import {AnyFunction} from "../../shared/types/props.type";

export const GET_USER = "GET_USER";
export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";

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