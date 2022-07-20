import {createReducer} from "@reduxjs/toolkit";
import {IBasicUser} from "../../../shared/types/user.type";
import {getPostLikers} from "../../actions/admin/admin.actions";

export type PostLikers = {
    likers: IBasicUser[],
    slug: string
}

export type AdminPostsLikersState = {
    pending: boolean;
    posts: PostLikers[]
}
const initial: AdminPostsLikersState = {
    pending: false,
    posts: []
}

export const adminPostsLikersReducer = createReducer(initial, (builder => {
    builder.addCase(getPostLikers.pending, (state) => {
        state.pending = true;
    }).addCase(getPostLikers.rejected, (state) => {
        state.pending = false;
    }).addCase(getPostLikers.fulfilled, (state, {payload}) => {
        state.pending = false;
        const found = state.posts.find((p) => p.slug === payload.slug);
        if (found) {
            state.posts.map((p) => {
                if (p.slug === payload.slug) return payload;
                return p;
            })
        } else {
            state.posts = [
                ...state.posts,
                payload
            ]
        }
    })
}))

export default adminPostsLikersReducer;