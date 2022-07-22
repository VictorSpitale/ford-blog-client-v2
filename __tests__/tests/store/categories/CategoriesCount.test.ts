import {
    categoriesCountReducer,
    CategoriesWithCountState
} from "../../../../context/reducers/categories/categoriesCount.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {
    createCategory,
    deleteCategory,
    getCategoriesWithCount,
    updateCategory
} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";
import * as fetch from "../../../../context/instance";
import {makeStore} from "../../../../context/store";

describe('CategoriesCount Actions & Reducers', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    const initialState: CategoriesWithCountState = {
        error: false,
        pending: false,
        categories: []
    }

    it('should return the initial state', function () {
        expect(categoriesCountReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getCategoriesWithCount', function () {

        it('should set pending true while fetching', function () {
            const action: AnyAction = {type: getCategoriesWithCount.pending};
            const state = categoriesCountReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true})
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {type: getCategoriesWithCount.rejected};
            const state = categoriesCountReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState)
        });

        it('should set the categories on fulfilled', function () {
            const action: AnyAction = {
                type: getCategoriesWithCount.fulfilled,
                payload: [{...CategoryStub("sport", "01"), count: 0}]
            };
            const state = categoriesCountReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                categories: [{...CategoryStub("sport", "01"), count: 0}]
            })
        });

        it('should fetch the categories and return the cached categories', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: [{...CategoryStub("sport", "01"), count: 0}]
            });
            const store = makeStore();
            await store.dispatch(getCategoriesWithCount());
            await store.dispatch(getCategoriesWithCount());
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith("/api/categories/count", {method: "get"});
            expect(store.getState().categoriesWithCount).toEqual({
                ...initialState, categories: [{...CategoryStub("sport", "01"), count: 0}]
            })
        });

    });

    describe('UpdateCategory', function () {

        it('should replace the category on update', function () {
            const action: AnyAction = {type: updateCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = categoriesCountReducer({
                ...initialState,
                categories: [
                    {count: 0, ...CategoryStub("sport", "01")},
                    {count: 0, ...CategoryStub("suv", "02")},
                ]
            }, action);
            expect(state).toEqual({
                ...initialState, categories: [
                    {count: 0, ...CategoryStub("gt", "01")},
                    {count: 0, ...CategoryStub("suv", "02")},
                ]
            })

        });

    });

    describe('DeleteCategory', function () {

        it('should filter the categories on delete', function () {
            const action: AnyAction = {type: deleteCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = categoriesCountReducer({
                ...initialState,
                categories: [
                    {count: 0, ...CategoryStub("gt", "01")},
                    {count: 0, ...CategoryStub("suv", "02")},
                ]
            }, action);
            expect(state).toEqual({
                ...initialState, categories: [
                    {count: 0, ...CategoryStub("suv", "02")},
                ]
            })

        });

    });

    describe('CreateCategory', function () {

        it('should not affect the state if categories are not fetched yet', function () {
            const action: AnyAction = {type: createCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = categoriesCountReducer(initialState, action);
            expect(state).toEqual(initialState);
        });

        it('should add the categories if they are already fetched', function () {
            const action: AnyAction = {type: createCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = categoriesCountReducer({
                ...initialState,
                categories: [
                    {count: 0, ...CategoryStub("suv", "02")},
                ]
            }, action);
            expect(state).toEqual({
                ...initialState, categories: [
                    {count: 0, ...CategoryStub("suv", "02")},
                    {count: 0, ...CategoryStub("gt", "01")},
                ]
            })

        });

    });

});