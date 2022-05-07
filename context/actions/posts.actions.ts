import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {ICreatePost, IPaginatedPosts, IPost, LikeStatus, UpdatePost} from "../../shared/types/post.type";
import {isEmpty, toFormData} from "../../shared/utils/object.utils";
import {instance} from "../instance";
import {NextPageContext} from "next";

export const GET_POSTS = "GET_POSTS"
export const GET_POST = "GET_POST"
export const GET_LAST_POSTS = "GET_LAST_POSTS"
export const CHANGE_LIKE_STATUS = "CHANGE_LIKE_STATUS"
export const DELETE_POST = "DELETE_POST";
export const CLEAN_POST = "CLEAN_POST";
export const UPDATE_POST = "UPDATE_POST";
export const GET_LIKED_POSTS = "GET_LIKED_POSTS";
export const CLEAN_LIKED_POSTS = "CLEAN_LIKED_POSTS";
export const CREATE_POST = "CREATE_POST";

export const getLastPosts = createAsyncThunk<IPost[], void, { state: RootState }>(GET_LAST_POSTS, async (_, {getState}) => {
    const {posts} = getState().lastPosts
    if (!isEmpty(posts) && posts.length === 6) {
        return posts
    }
    let response: IPost[] = []
    await instance.get('/posts/last').then((res) => response = res.data);
    return response
})

export const getPosts = createAsyncThunk<IPaginatedPosts, number | undefined, { state: RootState }>(GET_POSTS, async (page = 1, {getState}) => {
    const {paginatedPosts} = getState().posts
    if (paginatedPosts.page >= page) {
        return paginatedPosts;
    }
    let response = {} as IPaginatedPosts;
    await instance.get(`/posts?page=${page}`).then((res) => response = res.data)
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
export const cleanLikedPosts = createAction(CLEAN_LIKED_POSTS);

export const updatePost = createAsyncThunk<IPost, UpdatePost & { slug: string }, { state: RootState }>(UPDATE_POST, async (update) => {
    let response: IPost = {} as IPost
    await instance.patch(`/posts/${update.slug}`, update).then((res) => response = res.data);
    return response;
})

export const getLikedPost = createAsyncThunk<IPost[], string, { state: RootState }>(GET_LIKED_POSTS, async (id, {getState}) => {
    const {posts} = getState().likedPosts;
    if (!isEmpty(posts)) {
        return posts;
    }
    let response: IPost[] = []
    await instance.get(`/posts/liked/${id}`).then((res) => response = res.data);
    return response;
})

export const createPost = createAsyncThunk<IPost, ICreatePost, { state: RootState }>(CREATE_POST, async (post, {rejectWithValue}) => {
    let response = {} as IPost;
    return await instance.post('/posts', toFormData(post))
        .then(res => {
            response = res.data;
            return response;
        })
        .catch(res => {
            return rejectWithValue(res.response.data)
        })
})
