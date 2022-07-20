import {createReducer} from "@reduxjs/toolkit";
import {IPost} from "../../../shared/types/post.type";
import {getFilteredCommentedPostByUserId} from "../../actions/admin/admin.actions";

export type UserCommentedPosts = {
    posts: IPost[],
    userId: string
}

export type AdminCommentedPostsState = {
    pending: boolean;
    users: UserCommentedPosts[]
}
const initial: AdminCommentedPostsState = {
    pending: false,
    users: []
}

export const adminCommentedPostsReducer = createReducer(initial, (builder => {
    builder.addCase(getFilteredCommentedPostByUserId.pending, (state) => {
        state.pending = true;
    }).addCase(getFilteredCommentedPostByUserId.rejected, (state) => {
        state.pending = false;
    }).addCase(getFilteredCommentedPostByUserId.fulfilled, (state, {payload}) => {
        state.pending = false;
        const found = state.users.find((u) => u.userId === payload.userId);
        if (found) {
            state.users = state.users.map((u) => {
                if (u.userId === payload.userId) return payload;
                return u;
            })
        } else {
            state.users = [...state.users, payload];
        }
    })
}))

export default adminCommentedPostsReducer;