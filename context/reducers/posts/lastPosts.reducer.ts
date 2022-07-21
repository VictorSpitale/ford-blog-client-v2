import {IPost} from "../../../shared/types/post.type";
import {createPost, deletePost, getLastPosts, updatePost} from "../../actions/posts/posts.actions";
import {createReducer} from "@reduxjs/toolkit";
import {deleteCategory, updateCategory} from "../../actions/categories/categories.actions";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../actions/users/user.actions";

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
    }).addCase(deletePost.fulfilled, (state, {payload}) => {
        state.posts = state.posts.filter((post) => post.slug !== payload)
        state.pending = false;
    }).addCase(deletePost.pending, (state) => {
        state.pending = true;
    }).addCase(deletePost.rejected, (state) => {
        state.pending = false;
    }).addCase(updatePost.pending, (state) => {
        state.pending = true;
    }).addCase(updatePost.rejected, (state) => {
        state.pending = false;
    }).addCase(updatePost.fulfilled, (state, {payload}) => {
        state.pending = false;
        const toUpdate = state.posts.find((post) => post._id === payload._id);
        /* istanbul ignore else */
        if (toUpdate) {
            state.posts = state.posts.filter((post) => post._id !== payload._id)
            state.posts = [
                ...state.posts,
                payload
            ]
        }
    }).addCase(createPost.fulfilled, (state, {payload}) => {
        state.pending = false;
        const newPosts = [
            payload,
            ...state.posts
        ]
        if (newPosts.length > 6) newPosts.pop();
        state.posts = newPosts;
    }).addCase(createPost.pending, (state) => {
        state.pending = true;
    }).addCase(createPost.rejected, (state) => {
        state.pending = false;
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((p) => {
            return {
                ...p,
                categories: p.categories.map((cat) => {
                    if (cat._id === payload._id) return payload;
                    return cat;
                })
            }
        })
    }).addCase(deleteCategory.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((p) => {
            return {
                ...p,
                categories: p.categories.filter((cat) => cat._id !== payload._id)
            }
        })
    }).addCase(updateUser.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((p) => {
            return {
                ...p,
                comments: p.comments.map((com) => {
                    if (com.commenter._id === payload._id) return {
                        ...com,
                        commenter: {...com.commenter, pseudo: payload.pseudo}
                    }
                    return com;
                })
            }
        })
    }).addCase(removePicture.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((p) => {
            return {
                ...p,
                comments: p.comments.map((com) => {
                    if (com.commenter._id === payload._id) return {
                        ...com,
                        commenter: {...com.commenter, picture: undefined}
                    }
                    return com;
                })
            }
        })
    }).addCase(uploadPicture.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((p) => {
            return {
                ...p,
                comments: p.comments.map((com) => {
                    if (com.commenter._id === payload._id) return {
                        ...com,
                        commenter: {...com.commenter, picture: payload.picture}
                    }
                    return com;
                })
            }
        })
    }).addCase(deleteAccount.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((p) => {
            return {
                ...p,
                comments: p.comments.filter((com) => com.commenter._id !== payload._id)
            }
        })
    })
})
export default lastPostsReducer