import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {fetchApi} from "../../instance";
import {ICategory, ICategoryWithCount, UpdateCategory} from "../../../shared/types/category.type";
import {CategorySlideState} from "../../reducers/categories/categorySlide.reducer";
import {capitalize} from "../../../shared/utils/string.utils";
import {isEmpty} from "../../../shared/utils/object.utils";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const GET_CATEGORIES_WITH_COUNT = "GET_CATEGORIES_WITH_COUNT";
export const CREATE_CATEGORY = "CREATE_CATEGORY";

export const SET_SELECT_CATEGORIES = "SET_SELECT_CATEGORIES";
export const ADD_SELECT_CATEGORIES = "ADD_SELECT_CATEGORIES";
export const REMOVE_SELECT_CATEGORIES = "REMOVE_SELECT_CATEGORIES";

export const CATEGORY_SLIDE = "CATEGORY_SLIDE";

export const UPDATE_CATEGORY = "UPDATE_CATEGORY";

export const DELETE_CATEGORY = "DELETE_CATEGORY";

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

export const updateCategory = createAsyncThunk<ICategory, { data: UpdateCategory } & { id: string }>(UPDATE_CATEGORY, async (updateCategory, {rejectWithValue}) => {
    return await fetchApi("/api/categories/{id}", {
        method: "patch",
        json: {...updateCategory.data},
        params: {id: updateCategory.id}
    }).then((res) => {
        return res.data;
    }).catch((res) => {
        return rejectWithValue(res);
    })
})

export const deleteCategory = createAsyncThunk<ICategory, ICategory>(DELETE_CATEGORY, async (category) => {
    await fetchApi("/api/categories/{id}", {method: "delete", params: {id: category._id}});
    return category;
})