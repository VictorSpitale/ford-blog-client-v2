import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {IPost, LikeStatus} from "../../shared/types/post.type";
import {isEmpty} from "../../shared/utils/object.utils";
import {instance} from "../instance";
import {NextPageContext} from "next";

export const GET_POSTS = "GET_POSTS"
export const GET_POST = "GET_POST"
export const GET_LAST_POSTS = "GET_LAST_POSTS"
export const CHANGE_LIKE_STATUS = "CHANGE_LIKE_STATUS"
export const DELETE_POST = "DELETE_POST";
export const CLEAN_POST = "CLEAN_POST";

export const getLastPosts = createAsyncThunk<IPost[], void, { state: RootState }>(GET_LAST_POSTS, async (_, {getState}) => {
    const {posts} = getState().lastPosts
    if (!isEmpty(posts) && posts.length === 6) {
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

interface getPostParams {
    slug: string,
    context: NextPageContext<any>
}


export const getPost = createAsyncThunk<IPost, getPostParams, { state: RootState }>(GET_POST, async (attr, {getState}) => {

    const {post} = getState().post
    if (post.slug === attr.slug) {
        return post
    }
    let response: IPost = {} as IPost
    let headers;
    if (attr.context.req?.headers.cookie) {
        headers = {
            Cookie: attr.context.req.headers.cookie,
        }
    }
    await instance.get('/posts/' + attr.slug,
        {
            ...(attr.context.req
                ? {headers}
                : {}),
        }).then((res) => response = res.data)
    return response
})

interface changePostStatusParams {
    slug: string,
    status: LikeStatus,
}

export const changeLikeStatus = createAsyncThunk<number, changePostStatusParams>(CHANGE_LIKE_STATUS, async (attr) => {
    let response = 0
    await instance.patch(`/posts/${attr.status}/${attr.slug}`).then((res) => response = res.data);
    return response;
})

export const deletePost = createAsyncThunk<string, string, { state: RootState }>(DELETE_POST, async (slug) => {
    await instance.delete(`/posts/${slug}`);
    return slug;
})

export const cleanPost = createAction(CLEAN_POST);