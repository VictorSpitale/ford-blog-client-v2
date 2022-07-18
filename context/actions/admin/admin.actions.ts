import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AdminViews} from "../../../shared/types/adminViews.type";
import {PostLikers} from "../../reducers/admin/adminPostsLikers.reducer";
import {RootState} from "../../store";
import {fetchApi} from "../../instance";

export const SET_ADMIN_VIEW = "SET_ADMIN_VIEW";
export const GET_LIKERS = "GET_LIKERS";

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