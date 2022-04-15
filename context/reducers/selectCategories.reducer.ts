import {createReducer} from "@reduxjs/toolkit";
import {ICategory} from "../../shared/types/category.type";
import {addSelectedCategories, removeSelectedCategories, setSelectedCategories} from "../actions/categories.actions";

export type SelectCategoriesState = {
    categories: ICategory[];
}
const initial: SelectCategoriesState = {
    categories: [],
}

export const selectCategoriesReducer = createReducer(initial, (builder => {
    builder.addCase(setSelectedCategories, (state, {payload}) => {
        state.categories = payload;
    }).addCase(addSelectedCategories, (state, {payload}) => {
        state.categories = [
            ...state.categories,
            payload
        ];
    }).addCase(removeSelectedCategories, (state, {payload}) => {
        state.categories = state.categories.filter((cat) => cat._id !== payload._id);
    })
}))

export default selectCategoriesReducer;