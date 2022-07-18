import {createAsyncThunk} from "@reduxjs/toolkit";
import {IUser} from "../../../shared/types/user.type";
import {RootState} from "../../store";
import {isEmpty} from "../../../shared/utils/object.utils";
import {fetchApi} from "../../instance";

export const GET_USERS = "GET_USERS";

export const getUsers = createAsyncThunk<IUser[], void, { state: RootState }>(GET_USERS, async (_, {getState}) => {
    const {users} = getState().users;
    if (!isEmpty(users)) {
        return users;
    }
    let response: IUser[] = [];
    await fetchApi("/api/users", {method: "get"}).then((res) => {
        response = res.data as IUser[]
    })
    return response;
})