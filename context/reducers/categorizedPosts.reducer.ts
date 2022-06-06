import {IPost} from "../../shared/types/post.type";
import {createReducer} from "@reduxjs/toolkit";
import {getCategorizedPosts} from "../actions/posts.actions";

type Categorized = {
    category: string;
    posts: IPost[];
}

export type CategorizedPostsType = {
    posts: Categorized[];
    loading: boolean;
    error: boolean;
}

const initial: CategorizedPostsType = {
    posts: [] as Categorized[],
    loading: false,
    error: false
}

export const categorizedPostsReducer = createReducer(initial, (builder) => {
    builder.addCase(getCategorizedPosts.pending, (state) => {
        state.loading = true;
    }).addCase(getCategorizedPosts.fulfilled, (state, {payload}) => {
        const list = state.posts.find((list) => list.category === payload.category);
        if (!list) state.posts = [...state.posts, payload];
        state.loading = false;
    })
});
