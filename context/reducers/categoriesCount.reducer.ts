import {createReducer} from "@reduxjs/toolkit";
import {ICategoryWithCount} from "../../shared/types/category.type";
import {getCategoriesWithCount} from "../actions/categories.actions";

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
    })
}))

export default categoriesCountReducer;