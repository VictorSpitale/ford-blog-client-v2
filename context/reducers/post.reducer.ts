import {IPost} from "../../shared/types/post.type";
import {createReducer} from "@reduxjs/toolkit";
import {
    changeLikeStatus,
    cleanPost,
    commentPost,
    createPost,
    deletePostComment,
    getPost,
    updatePost,
    updatePostComment
} from "../actions/posts.actions";

export type PostState = {
    post: IPost;
    pending: boolean;
    error: boolean
}

const initial: PostState = {
    post: {} as IPost,
    pending: false,
    error: false
}
export const
    postReducer = createReducer(initial, (builder) => {
        builder.addCase(getPost.pending, (state) => {
            state.pending = true
        }).addCase(getPost.fulfilled, (state, {payload}) => {
            state.pending = false
            state.post = payload
        }).addCase(getPost.rejected, (state) => {
            state.pending = false
            state.error = true
        }).addCase(changeLikeStatus.fulfilled, (state, {payload}) => {
            state.post.likes = payload
            state.post.authUserLiked = !state.post.authUserLiked
        }).addCase(cleanPost, (state) => {
            state.post = {} as IPost
        }).addCase(updatePost.pending, (state) => {
            state.pending = true
        }).addCase(updatePost.fulfilled, (state, {payload}) => {
            state.pending = false
            state.post = payload
        }).addCase(updatePost.rejected, (state) => {
            state.pending = false
            state.error = true
        }).addCase(createPost.pending, (state) => {
            state.pending = true;
        }).addCase(createPost.rejected, (state) => {
            state.pending = false;
        }).addCase(createPost.fulfilled, (state, {payload}) => {
            state.pending = false;
            state.post = payload;
        }).addCase(deletePostComment.pending, (state) => {
            state.pending = true;
        }).addCase(deletePostComment.rejected, (state) => {
            state.pending = false;
        }).addCase(deletePostComment.fulfilled, (state, {payload}) => {
            state.pending = false;
            state.post = payload;
        }).addCase(updatePostComment.pending, (state) => {
            state.pending = true;
        }).addCase(updatePostComment.rejected, (state) => {
            state.pending = false;
        }).addCase(updatePostComment.fulfilled, (state, {payload}) => {
            state.pending = false;
            state.post = payload;
        }).addCase(commentPost.pending, (state) => {
            state.pending = true;
        }).addCase(commentPost.rejected, (state) => {
            state.pending = false;
        }).addCase(commentPost.fulfilled, (state, {payload}) => {
            state.pending = false;
            state.post = payload;
        })
    })
export default postReducer