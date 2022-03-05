import {IPost} from "../../shared/types/post.type";
import {getPosts} from "../actions/posts.actions";
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
export const postsReducer = createReducer(initial, (builder) => {
    builder.addCase(getPosts.pending, (state) => {
        state.pending = true
    }).addCase(getPosts.fulfilled, (state, {payload}) => {
        state.pending = false
        state.posts = payload
    }).addCase(getPosts.rejected, (state) => {
        state.pending = false
        state.error = true
    })
})
export default postsReducer