import {IPaginatedPosts} from "../../shared/types/post.type";
import {getPosts} from "../actions/posts.actions";
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
        state.pending = true
    }).addCase(getPosts.fulfilled, (state, {payload}) => {
        state.pending = false
        const unfiltered = [...state.paginatedPosts.posts, ...payload.posts];
        const uniquePosts = _.uniqBy(unfiltered, "_id");
        state.paginatedPosts = {
            ...payload,
            posts: uniquePosts,
        }
    }).addCase(getPosts.rejected, (state) => {
        state.pending = false
    })
})

export default postsReducer