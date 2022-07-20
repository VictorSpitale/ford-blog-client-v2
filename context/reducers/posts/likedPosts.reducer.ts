import {createReducer} from "@reduxjs/toolkit";
import {IPost} from "../../../shared/types/post.type";
import {cleanLikedPosts, getLikedPosts} from "../../actions/posts/posts.actions";

export type LikedPostsState = {
    users: {
        posts: IPost[];
        userId: string
    }[]
    pending: boolean;
    error: boolean;
}
const initial: LikedPostsState = {
    users: [],
    pending: false,
    error: false
}

export const likedPostsReducer = createReducer(initial, (builder => {
    builder.addCase(getLikedPosts.pending, (state) => {
        state.pending = true;
    }).addCase(getLikedPosts.fulfilled, (state, {payload}) => {
        state.pending = false;
        const found = state.users.find((u) => u.userId === payload.userId);
        if (found) {
            state.users = state.users.map((u) => {
                if (u.userId === payload.userId) return payload;
                return u;
            })
        } else {
            state.users = [
                ...state.users,
                payload
            ]
        }
    }).addCase(getLikedPosts.rejected, (state) => {
        state.pending = false;
    }).addCase(cleanLikedPosts, (state, {payload}) => {
        state.users = state.users.filter((u) => u.userId !== payload);
    })
}));

export default likedPostsReducer;