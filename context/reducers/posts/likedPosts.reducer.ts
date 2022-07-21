import {createReducer} from "@reduxjs/toolkit";
import {IPost} from "../../../shared/types/post.type";
import {cleanLikedPosts, deletePost, getLikedPosts} from "../../actions/posts/posts.actions";
import {updateCategory} from "../../actions/categories/categories.actions";

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
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.users = state.users.map((list) => {
            return {
                ...list,
                posts: list.posts.map((p) => {
                    return {
                        ...p,
                        categories: p.categories.map((cat) => {
                            if (cat._id === payload._id) return payload;
                            return cat;
                        })
                    }
                })
            }
        })
    }).addCase(deletePost.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            return {
                ...u,
                posts: u.posts.filter((p) => p.slug !== payload)
            }
        })
    })
}));

export default likedPostsReducer;