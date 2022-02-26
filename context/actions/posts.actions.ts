import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {IPost} from "../../shared/types/post.type";
import {isEmpty} from "../../shared/utils/object.utils";

export const GET_POSTS = "GET_POSTS"

export const getPosts = createAsyncThunk<IPost[], void, { state: RootState }>(GET_POSTS, async (_, {getState}) => {
    const {posts} = getState().posts
    if (!isEmpty(posts)) {
        return posts
    }
    return await fetch('http://localhost:5000/api/post').then((res) => res.json())
})
export const GET_POST = "GET_POST"

export const getPost = createAsyncThunk<IPost, string, { state: RootState }>(GET_POST, async (slug, {getState}) => {

    const {post} = getState().post
    if (post.slug === slug) {
        return post
    }

    return await fetch('http://localhost:5000/api/post/' + slug).then((res) => res.json())
})