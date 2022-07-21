import {IPaginatedPosts} from "../../../shared/types/post.type";
import {
    commentPost,
    deletePost,
    deletePostComment,
    getPosts,
    updatePost,
    updatePostComment
} from "../../actions/posts/posts.actions";
import {createReducer} from "@reduxjs/toolkit";
import _ from 'lodash';
import {deleteCategory, updateCategory} from "../../actions/categories/categories.actions";

export type PostsState = {
    paginatedPosts: IPaginatedPosts;
    pending: boolean;
    error: boolean
}

const initial: PostsState = {
    paginatedPosts: {
        hasMore: true,
        posts: [],
        page: 0
    },
    pending: false,
    error: false
}
export const postsReducer = createReducer(initial, (builder) => {
    builder.addCase(getPosts.pending, (state) => {
        state.pending = true;
    }).addCase(getPosts.fulfilled, (state, {payload}) => {
        state.pending = false;
        const unfiltered = [...state.paginatedPosts.posts, ...payload.posts];
        const uniquePosts = _.uniqBy(unfiltered, "_id");
        state.paginatedPosts = {
            ...payload,
            posts: uniquePosts,
            page: parseInt(String(payload.page))
        }
    }).addCase(getPosts.rejected, (state) => {
        state.pending = false;
    }).addCase(updatePost.pending, (state) => {
        state.pending = true;
    }).addCase(updatePost.rejected, (state) => {
        state.pending = false;
    }).addCase(updatePost.fulfilled, (state, {payload}) => {
        const post = state.paginatedPosts.posts.find((p) => p._id === payload._id);
        const list = state.paginatedPosts.posts;
        if (post) {
            state.paginatedPosts.posts = list.map((p) => {
                if (p._id === payload._id) return payload
                return p;
            })
        }
    }).addCase(deletePost.pending, (state) => {
        state.pending = true;
    }).addCase(deletePost.rejected, (state) => {
        state.pending = false;
    }).addCase(deletePost.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.paginatedPosts.posts = state.paginatedPosts.posts.filter((p) => p.slug !== payload);
    }).addCase(commentPost.fulfilled, (state, {payload}) => {
        state.paginatedPosts.posts = state.paginatedPosts.posts.map((p) => {
            if (p._id === payload._id) return payload;
            return p;
        })
    }).addCase(updatePostComment.fulfilled, (state, {payload}) => {
        state.paginatedPosts.posts = state.paginatedPosts.posts.map((p) => {
            if (p._id === payload._id) return payload;
            return p;
        })
    }).addCase(deletePostComment.fulfilled, (state, {payload}) => {
        state.paginatedPosts.posts = state.paginatedPosts.posts.map((p) => {
            if (p._id === payload._id) return payload;
            return p;
        })
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.paginatedPosts.posts = state.paginatedPosts.posts.map((p) => {
            return {
                ...p,
                categories: p.categories.map((cat) => {
                    if (cat._id === payload._id) return payload;
                    return cat;
                })
            }
        })
    }).addCase(deleteCategory.fulfilled, (state, {payload}) => {
        state.paginatedPosts.posts = state.paginatedPosts.posts.map((p) => {
            return {
                ...p,
                categories: p.categories.filter((cat) => cat._id !== payload._id)
            }
        })
    })
})

export default postsReducer