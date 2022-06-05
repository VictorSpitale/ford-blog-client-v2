import {createReducer} from "@reduxjs/toolkit";
import {ICategory} from "../../shared/types/category.type";
import {setCategorySlide} from "../actions/categories.actions";

export type CategorySlideState = {
    category: ICategory | undefined;
}
const initial: CategorySlideState = {
    category: undefined,
}

export const categorySlideReducer = createReducer(initial, (builder => {
    builder.addCase(setCategorySlide, (state, {payload}) => {
        state.category = payload.category;
    })
}))

export default categorySlideReducer;