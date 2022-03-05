import {IPost} from "../../shared/types/post.type";
import {getLastPosts} from "../actions/posts.actions";
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
    })
})
export default lastPostsReducer