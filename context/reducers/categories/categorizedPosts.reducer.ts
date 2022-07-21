import {IPost} from "../../../shared/types/post.type";
import {createReducer} from "@reduxjs/toolkit";
import {getCategorizedPosts} from "../../actions/posts/posts.actions";
import {updateCategory} from "../../actions/categories/categories.actions";
import {ICategory} from "../../../shared/types/category.type";

export type Categorized = {
    category: ICategory;
    posts: IPost[];
}

export type CategorizedPostsType = {
    posts: Categorized[];
    pending: boolean;
    error: boolean;
}

const initial: CategorizedPostsType = {
    posts: [] as Categorized[],
    pending: false,
    error: false
}

export const categorizedPostsReducer = createReducer(initial, (builder) => {
    builder.addCase(getCategorizedPosts.pending, (state) => {
        state.pending = true;
    }).addCase(getCategorizedPosts.fulfilled, (state, {payload}) => {
        const list = state.posts.find((list) => list.category === payload.category);
        if (!list) {
            state.posts = [...state.posts, payload];
        } else {
            const filteredState = state.posts.filter((l) => l.category !== payload.category);
            state.posts = [
                ...filteredState,
                payload
            ]
        }
        state.pending = false;
    }).addCase(getCategorizedPosts.rejected, (state) => {
        state.pending = false
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        // Need refactoring to have cat id in the state
    })
});
