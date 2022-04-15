import {IPost} from "../../shared/types/post.type";
import {createReducer} from "@reduxjs/toolkit";
import {changeLikeStatus, cleanPost, getPost, updatePost} from "../actions/posts.actions";

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
export const postReducer = createReducer(initial, (builder) => {
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
    })
})
export default postReducer