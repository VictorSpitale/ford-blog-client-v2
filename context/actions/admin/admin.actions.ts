import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AdminViews} from "../../../shared/types/adminViews.type";
import {PostLikers} from "../../reducers/admin/adminPostsLikers.reducer";
import {RootState} from "../../store";
import {fetchApi} from "../../instance";
import {IUser} from "../../../shared/types/user.type";
import {UserCommentedPosts} from "../../reducers/admin/adminCommentedPosts.reducer";

export const SET_ADMIN_VIEW = "SET_ADMIN_VIEW";
export const GET_LIKERS = "GET_LIKERS";
export const GET_USER_BY_ID = "GET_USER_BY_ID";
export const GET_COMMENTED_POST_BY_USERID = "GET_FILTERED_COMMENTED_POST_BY_USERID"

export const setAdminView = createAction<AdminViews>(SET_ADMIN_VIEW);

export const getPostLikers = createAsyncThunk<PostLikers, string, { state: RootState }>(GET_LIKERS, async (slug, {getState}) => {
    const {posts} = getState().adminPostsLikers;
    const found = posts.find((p) => p.slug === slug);
    if (found) return found;

    let response = {} as PostLikers;
    await fetchApi("/api/posts/{slug}/likers", {method: "get", params: {slug}}).then((res) => {
        response = {likers: res.data, slug};
    })

    return response;
})

export const getUserById = createAsyncThunk<IUser, string, { state: RootState }>(GET_USER_BY_ID, async (id, {getState}) => {
    const {users} = getState().users;
    const found = users.find((u) => u._id === id);
    if (found) return found;
    let response = {} as IUser;
    await fetchApi("/api/users/{id}", {method: "get", params: {id}}).then((res) => {
        response = res.data as IUser;
    })
    return response;
})

export const getCommentedPostByUserId = createAsyncThunk<UserCommentedPosts, string, { state: RootState }>(GET_COMMENTED_POST_BY_USERID, async (id, {getState}) => {
    const {users} = getState().adminCommentedPosts;
    const found = users.find((u) => u.userId === id);
    if (found) return found;
    let response = {} as UserCommentedPosts;
    await fetchApi("/api/users/{id}/comments", {method: "get", params: {id}}).then((res) => {
        response = {
            posts: res.data,
            userId: id
        }
    })
    return response;
})