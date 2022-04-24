import {IPost} from "../../shared/types/post.type";
import {createPost, deletePost, getLastPosts, updatePost} from "../actions/posts.actions";
import {createReducer} from "@reduxjs/toolkit";

export type PostsState = {
    posts: IPost[];
    pending: boolean;
    error: boolean
}

const initial: PostsState = {
    posts: [],
    pending: false,
    error: false
}
export const lastPostsReducer = createReducer(initial, (builder) => {
    builder.addCase(getLastPosts.pending, (state) => {
        state.pending = true
    }).addCase(getLastPosts.fulfilled, (state, {payload}) => {
        state.pending = false
        state.posts = payload
    }).addCase(getLastPosts.rejected, (state) => {
        state.pending = false
        state.error = true
    }).addCase(deletePost.fulfilled, (state, {payload}) => {
        state.posts = state.posts.filter((post) => post.slug !== payload)
        state.pending = false;
    }).addCase(deletePost.pending, (state) => {
        state.pending = true;
    }).addCase(updatePost.fulfilled, (state, {payload}) => {
        const toUpdate = state.posts.find((post) => post.slug === payload.slug);
        if (toUpdate) {
            state.posts = state.posts.filter((post) => post.slug !== payload.slug)
            state.posts = [
                ...state.posts,
                payload
            ]
        }
    }).addCase(createPost.fulfilled, (state, {payload}) => {
        const newPosts = [
            payload,
            ...state.posts
        ]
        if (newPosts.length > 6) newPosts.pop();
        state.posts = newPosts;
    })
})
export default lastPostsReducer