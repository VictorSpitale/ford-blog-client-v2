import {createReducer} from "@reduxjs/toolkit";
import {IPost} from "../../shared/types/post.type";
import {cleanLikedPosts, getLikedPost} from "../actions/posts.actions";

export type LikedPostsState = {
    posts: IPost[];
    pending: boolean;
    error: boolean;
}
const initial: LikedPostsState = {
    posts: [],
    pending: false,
    error: false
}

export const likedPostsReducer = createReducer(initial, (builder => {
    builder.addCase(getLikedPost.pending, (state) => {
        state.pending = true;
    }).addCase(getLikedPost.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.posts = payload;
    }).addCase(getLikedPost.rejected, (state) => {
        state.pending = false;
    }).addCase(cleanLikedPosts, (state) => {
        state.posts = [];
    })
}));

export default likedPostsReducer;