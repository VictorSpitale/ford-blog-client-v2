import {createReducer} from "@reduxjs/toolkit";
import {ICategory} from "../../shared/types/category.type";
import {createCategory, getCategories} from "../actions/categories.actions";
import {clearError} from "../actions/errors.actions";

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
        state.categories = payload
    }).addCase(createCategory.pending, (state) => {
        state.pending = true;
    }).addCase(createCategory.rejected, (state) => {
        state.pending = false;
        state.error = true;
    }).addCase(createCategory.fulfilled, (state, {payload}) => {
        state.categories = [
            ...state.categories,
            payload
        ]
        state.pending = false
    }).addCase(clearError, (state) => {
        state.error = false;
    })
}))

export default categoriesReducer;