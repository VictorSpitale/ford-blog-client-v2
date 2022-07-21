import {createReducer} from "@reduxjs/toolkit";
import {ICategoryWithCount} from "../../../shared/types/category.type";
import {getCategoriesWithCount, updateCategory} from "../../actions/categories/categories.actions";

export type CategoriesWithCountState = {
    categories: ICategoryWithCount[];
    pending: boolean;
    error: boolean
}
const initial: CategoriesWithCountState = {
    categories: [],
    pending: false,
    error: false
}

export const categoriesCountReducer = createReducer(initial, (builder => {
    builder.addCase(getCategoriesWithCount.fulfilled, (state, {payload}) => {
        state.pending = false;
        state.categories = payload;
    }).addCase(getCategoriesWithCount.pending, (state) => {
        state.pending = true;
    }).addCase(getCategoriesWithCount.rejected, (state) => {
        state.pending = false;
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.categories = state.categories.map((cat) => {
            if (cat._id === payload._id) return {...cat, ...payload};
            return cat;
        })
    })
}))

export default categoriesCountReducer;