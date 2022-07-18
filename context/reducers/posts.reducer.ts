import {IPaginatedPosts} from "../../shared/types/post.type";
import {deletePost, getPosts, updatePost} from "../actions/posts.actions";
import {createReducer} from "@reduxjs/toolkit";
import _ from 'lodash';

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
    })
})

export default postsReducer