import {createReducer} from "@reduxjs/toolkit";
import {ICategory} from "../../../shared/types/category.type";
import {createCategory, getCategories, updateCategory} from "../../actions/categories/categories.actions";

export type CategoriesState = {
    categories: ICategory[];
    pending: boolean;
    error: boolean
}
const initial: CategoriesState = {
    categories: [],
    pending: false,
    error: false
}

export const categoriesReducer = createReducer(initial, (builder => {
    builder.addCase(getCategories.fulfilled, (state, {payload}) => {
        state.categories = payload;
        state.pending = false;
    }).addCase(getCategories.pending, (state) => {
        state.pending = true;
    }).addCase(getCategories.rejected, (state) => {
        state.pending = false;
    }).addCase(createCategory.pending, (state) => {
        state.pending = true;
    }).addCase(createCategory.rejected, (state) => {
        state.pending = false;
    }).addCase(createCategory.fulfilled, (state, {payload}) => {
        state.categories = [
            ...state.categories,
            payload
        ]
        state.pending = false
    }).addCase(updateCategory.pending, (state) => {
        state.pending = true;
    }).addCase(updateCategory.rejected, (state) => {
        state.pending = false
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.categories = state.categories.map((cat) => {
            if (cat._id === payload._id) return payload;
            return cat;
        })
    })
}))

export default categoriesReducer;