import {createReducer} from "@reduxjs/toolkit";
import {IBasicPost} from "../../../shared/types/post.type";
import {cleanLikedPosts, getLikedPosts} from "../../actions/posts/posts.actions";

export type LikedPostsState = {
    posts: IBasicPost[];
    pending: boolean;
    error: boolean;
}
const initial: LikedPostsState = {
    posts: [],
    pending: false,
    error: false
}

export const likedPostsReducer = createReducer(initial, (builder => {
    builder.addCase(getLikedPosts.pending, (state) => {
        state.pending = true;
    }).addCase(getLikedPosts.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.posts = payload;
    }).addCase(getLikedPosts.rejected, (state) => {
        state.pending = false;
    }).addCase(cleanLikedPosts, (state) => {
        state.posts = [];
    })
}));

export default likedPostsReducer;