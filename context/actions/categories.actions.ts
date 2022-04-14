import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {instance} from "../instance";
import {ICategory} from "../../shared/types/category.type";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const CREATE_CATEGORY = "CREATE_CATEGORY";

export const SET_SELECT_CATEGORIES = "SET_SELECT_CATEGORIES"
export const ADD_SELECT_CATEGORIES = "ADD_SELECT_CATEGORIES"
export const REMOVE_SELECT_CATEGORIES = "REMOVE_SELECT_CATEGORIES"

export const getCategories = createAsyncThunk<ICategory[], void, { state: RootState }>(GET_CATEGORIES, async (_, {getState}) => {
    let response: ICategory[] = [];
    await instance.get('/categories').then(res => {
        response = res.data;
    });
    return response;
})

export const createCategory = createAsyncThunk<ICategory, string, { state: RootState }>(CREATE_CATEGORY, async (name) => {
    let response: ICategory = {} as ICategory;
    await instance.post('/categories', {name}).then(res => {
        response = res.data;
    })
    return response;
})

export const setSelectedCategories = createAction<ICategory[]>(SET_SELECT_CATEGORIES);
export const addSelectedCategories = createAction<ICategory>(ADD_SELECT_CATEGORIES);
export const removeSelectedCategories = createAction<ICategory>(REMOVE_SELECT_CATEGORIES);