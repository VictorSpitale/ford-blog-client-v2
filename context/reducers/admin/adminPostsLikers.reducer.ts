import {createReducer} from "@reduxjs/toolkit";
import {IBasicUser} from "../../../shared/types/user.type";
import {getPostLikers} from "../../actions/admin/admin.actions";
import {deletePost} from "../../actions/posts/posts.actions";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../actions/users/user.actions";

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
            state.posts = state.posts.map((p) => {
                if (p.slug === payload.slug) return payload;
                return p;
            })
        } else {
            state.posts = [
                ...state.posts,
                payload
            ]
        }
    }).addCase(deletePost.fulfilled, (state, {payload}) => {
        state.posts = state.posts.filter((p) => p.slug !== payload);
    }).addCase(uploadPicture.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((lp) => {
            return {
                ...lp,
                likers: lp.likers.map((u) => {
                    if (u._id === payload._id) return {...u, picture: payload.picture}
                    return u;
                })
            }
        })
    }).addCase(removePicture.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((lp) => {
            return {
                ...lp,
                likers: lp.likers.map((u) => {
                    if (u._id === payload._id) return {...u, picture: undefined}
                    return u;
                })
            }
        })
    }).addCase(updateUser.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((lp) => {
            return {
                ...lp,
                likers: lp.likers.map((u) => {
                    if (u._id === payload._id) return {...u, pseudo: payload.pseudo}
                    return u;
                })
            }
        })
    }).addCase(deleteAccount.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((lp) => {
            return {
                ...lp,
                likers: lp.likers.filter((u) => u._id !== payload._id)
            }
        })
    })
}))

export default adminPostsLikersReducer;