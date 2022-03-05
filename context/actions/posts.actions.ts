import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {IPost} from "../../shared/types/post.type";
import {isEmpty} from "../../shared/utils/object.utils";
import {instance} from "../instance";

export const GET_POSTS = "GET_POSTS"
export const GET_POST = "GET_POST"
export const GET_LAST_POSTS = "GET_LAST_POSTS"

export const getLastPosts = createAsyncThunk<IPost[], void, { state: RootState }>(GET_LAST_POSTS, async (_, {getState}) => {
    const {posts} = getState().lastPosts
    if (!isEmpty(posts)) {
        return posts
    }
    let response: IPost[] = []
    await instance.get('/posts/last').then((res) => response = res.data)
    return response
})

export const getPosts = createAsyncThunk<IPost[], void, { state: RootState }>(GET_POSTS, async (_, {getState}) => {
    const {posts} = getState().posts
    if (!isEmpty(posts)) {
        return posts
    }
    let response: IPost[] = []
    await instance.get('/posts').then((res) => response = res.data)
    return response
})

export const getPost = createAsyncThunk<IPost, string, { state: RootState }>(GET_POST, async (slug, {getState}) => {

    const {post} = getState().post
    if (post.slug === slug) {
        return post
    }
    let response: IPost = {} as IPost
    await instance.get('/posts/' + slug).then((res) => response = res.data)
    return response
})