import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {fetchApi} from "../instance";
import {ICategory, ICategoryWithCount} from "../../shared/types/category.type";
import {CategorySlideState} from "../reducers/categorySlide.reducer";
import {capitalize} from "../../shared/utils/string.utils";
import {isEmpty} from "../../shared/utils/object.utils";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const GET_CATEGORIES_WITH_COUNT = "GET_CATEGORIES_WITH_COUNT";
export const CREATE_CATEGORY = "CREATE_CATEGORY";

export const SET_SELECT_CATEGORIES = "SET_SELECT_CATEGORIES"
export const ADD_SELECT_CATEGORIES = "ADD_SELECT_CATEGORIES"
export const REMOVE_SELECT_CATEGORIES = "REMOVE_SELECT_CATEGORIES"

export const CATEGORY_SLIDE = "CATEGORY_SLIDE"

export const getCategories = createAsyncThunk<ICategory[], void, { state: RootState }>(GET_CATEGORIES, async (_, {getState}) => {
    const categories = getState().categories.categories;
    if (!isEmpty(categories)) {
        return categories;
    }
    let response: ICategory[] = [];
    await fetchApi("/api/categories", {method: "get"}).then((res) => response = res.data);
    return response;
})

export const getCategoriesWithCount = createAsyncThunk<ICategoryWithCount[], void, { state: RootState }>(GET_CATEGORIES_WITH_COUNT, async (_, {getState}) => {
    const categories = getState().categoriesWithCount.categories;
    if (!isEmpty(categories)) {
        return categories;
    }
    let response: ICategoryWithCount[] = [];
    await fetchApi("/api/categories/count", {method: "get"}).then((res) => response = res.data);
    return response;
})

export const createCategory = createAsyncThunk<ICategory, string, { state: RootState }>(CREATE_CATEGORY, async (name) => {
    let response: ICategory = {} as ICategory;
    name = capitalize(name);
    await fetchApi("/api/categories", {method: "post", json: {name}}).then((res) => {
        response = res.data
    })
    return response;
})

export const setSelectedCategories = createAction<ICategory[]>(SET_SELECT_CATEGORIES);
export const addSelectedCategories = createAction<ICategory>(ADD_SELECT_CATEGORIES);
export const removeSelectedCategories = createAction<ICategory>(REMOVE_SELECT_CATEGORIES);
export const setCategorySlide = createAction<CategorySlideState>(CATEGORY_SLIDE);