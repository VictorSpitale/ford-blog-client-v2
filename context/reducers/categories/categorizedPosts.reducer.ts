import {IPost} from "../../../shared/types/post.type";
import {createReducer} from "@reduxjs/toolkit";
import {deletePost, getCategorizedPosts} from "../../actions/posts/posts.actions";
import {deleteCategory, updateCategory} from "../../actions/categories/categories.actions";
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
        const list = state.posts.find((list) => list.category._id === payload.category._id);
        if (!list) {
            state.posts = [...state.posts, payload];
        } else {
            const filteredState = state.posts.filter((l) => l.category._id !== payload.category._id);
            state.posts = [
                ...filteredState,
                payload
            ]
        }
        state.pending = false;
    }).addCase(getCategorizedPosts.rejected, (state) => {
        state.pending = false
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((categorized) => {
            let catName = categorized.category.name;
            if (categorized.category._id === payload._id) catName = payload.name;
            return {
                category: {_id: categorized.category._id, name: catName},
                posts: categorized.posts.map((p) => {
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
    }).addCase(deleteCategory.fulfilled, (state, {payload}) => {
        state.posts = state.posts.filter((categorized) => categorized.category._id !== payload._id)
            .map((categorized) => {
                return {
                    ...categorized,
                    posts: categorized.posts.map((p) => {
                        return {
                            ...p,
                            categories: p.categories.filter((cat) => cat._id !== payload._id)
                        }
                    })
                }
            })
    }).addCase(deletePost.fulfilled, (state, {payload}) => {
        state.posts = state.posts.map((categorized) => {
            return {
                ...categorized,
                posts: categorized.posts.filter((p) => p.slug !== payload)
            }
        })
    })
});
