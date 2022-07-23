import {categoriesReducer, CategoriesState} from "../../../../context/reducers/categories/categories.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory
} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";
import {makeStore} from "../../../../context/store";
import * as fetch from "../../../../context/instance";
import {capitalize} from "../../../../shared/utils/string.utils";
import {HttpErrorStub} from "../../../stub/HttpErrorStub";

describe('Categories Reducer & Actions', function () {

    const initialState: CategoriesState = {
        categories: [], pending: false, error: false
    }


    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return the initialState', () => {
        expect(categoriesReducer(undefined, {} as AnyAction)).toEqual(initialState);
    })

    describe("Get Categories", () => {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: getCategories.pending
            }
            const state = categoriesReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on fulfilled fetch the categories', () => {
            const action: AnyAction = {
                type: getCategories.fulfilled, payload: [CategoryStub()]
            }
            const state = categoriesReducer({
                ...initialState,
                pending: true
            }, action);
            expect(state).toEqual({
                ...initialState, categories: [CategoryStub()]
            })
        })

        it('should fetch the categories (action) and return the cached categories', async () => {
            const store = makeStore();
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: [CategoryStub()]
            })
            await store.dispatch(getCategories());
            await store.dispatch(getCategories());
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('/api/categories', {method: "get"});
            expect(store.getState().categories.categories).toEqual([CategoryStub()]);
        })

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: getCategories.rejected
            }
            const state = categoriesReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false
            })
        });

    })

    describe('Create Category', function () {

        it('should set pending true while creating', () => {
            const action: AnyAction = {type: createCategory.pending};
            const state = categoriesReducer(initialState, action);
            expect(state).toEqual({
                ...initialState, pending: true
            })
        })

        it('should set pending false on fulfilled', () => {
            const action: AnyAction = {type: createCategory.fulfilled, payload: CategoryStub()};
            const state = categoriesReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState, pending: false, categories: [CategoryStub()]
            })
        })

        it('should set pending false on rejected (error unused)', () => {
            const action: AnyAction = {type: createCategory.rejected};
            const state = categoriesReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState, pending: false
            })
        })

        it('should create a category (action)', async () => {
            const name = "mustang";
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: CategoryStub(name)
            });
            const store = makeStore();
            await store.dispatch(createCategory(name));
            expect(spy).toHaveBeenCalledWith("/api/categories", {method: "post", json: {name: capitalize(name)}});
            expect(store.getState().categories.categories).toEqual([CategoryStub(name)]);
            spy.mockClear();
        })

        it('should create a category and add it to the categories (action)', async () => {
            const name = "mustang";
            const snName = "suv";
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: CategoryStub(name)
            }).mockResolvedValueOnce({
                data: CategoryStub(snName)
            });
            const store = makeStore();
            await store.dispatch(createCategory(name));
            await store.dispatch(createCategory(snName));
            expect(spy).toHaveBeenNthCalledWith(1, "/api/categories", {method: "post", json: {name: capitalize(name)}});
            expect(spy).toHaveBeenNthCalledWith(2, "/api/categories", {
                method: "post",
                json: {name: capitalize(snName)}
            });
            expect(store.getState().categories.categories).toEqual([CategoryStub(name), CategoryStub(snName)]);
        })

    });

    describe('Update Category', function () {

        it('should set pending true while updating', () => {
            const action: AnyAction = {type: updateCategory.pending};
            const state = categoriesReducer(initialState, action);
            expect(state).toEqual({
                ...initialState, pending: true
            })
        })

        it('should set pending false on fulfilled', () => {
            const action: AnyAction = {type: updateCategory.fulfilled, payload: CategoryStub("gt", "01")};
            const state = categoriesReducer({
                ...initialState, pending: true,
                categories: [
                    CategoryStub("sport", "01"),
                    CategoryStub()
                ]
            }, action);
            expect(state).toEqual({
                ...initialState, pending: false,
                categories: [
                    CategoryStub("gt", "01"),
                    CategoryStub()
                ]
            })
        })

        it('should set pending false on rejected (error unused)', () => {
            const action: AnyAction = {type: updateCategory.rejected};
            const state = categoriesReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState, pending: false
            })
        })

        it('should update a category then reject the update', async () => {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: [CategoryStub("sport", "01"), CategoryStub("suv", "02")]
            }).mockResolvedValueOnce({
                data: CategoryStub("gt", "01")
            }).mockRejectedValueOnce(HttpErrorStub());
            const store = makeStore();
            await store.dispatch(getCategories());
            await store.dispatch(updateCategory({data: {name: "gt"}, id: CategoryStub("sport", "01")._id}));
            await store.dispatch(updateCategory({
                data: {name: "gt"},
                id: CategoryStub("sport", "01")._id
            })).then((res) => {
                expect(res).toEqual({...res, payload: HttpErrorStub()})
            });
            expect(spy).toHaveBeenNthCalledWith(2, "/api/categories/{id}", {
                method: "patch",
                json: {name: "gt"},
                params: {id: CategoryStub("sport", "01")._id}
            });
            expect(store.getState().categories.categories).toEqual(
                [
                    CategoryStub("gt", "01"),
                    CategoryStub("suv", "02")
                ]
            );
        })
    });

    describe('Delete Category', function () {

        it('should set pending true while deleting', () => {
            const action: AnyAction = {type: deleteCategory.pending};
            const state = categoriesReducer(initialState, action);
            expect(state).toEqual({
                ...initialState, pending: true
            })
        })

        it('should set pending false on fulfilled', () => {
            const action: AnyAction = {type: deleteCategory.fulfilled, payload: CategoryStub("gt", "01")};
            const state = categoriesReducer({
                ...initialState, pending: true,
                categories: [
                    CategoryStub("gt", "01"),
                    CategoryStub()
                ]
            }, action);
            expect(state).toEqual({
                ...initialState, pending: false,
                categories: [
                    CategoryStub()
                ]
            })
        })

        it('should set pending false on rejected (error unused)', () => {
            const action: AnyAction = {type: deleteCategory.rejected};
            const state = categoriesReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState, pending: false
            })
        })

        it('should delete a category', async () => {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: [CategoryStub("sport", "01"), CategoryStub("suv", "02")]
            }).mockResolvedValueOnce({});
            const store = makeStore();
            await store.dispatch(getCategories());
            await store.dispatch(deleteCategory(CategoryStub("sport", "01")));
            expect(spy).toHaveBeenNthCalledWith(2, "/api/categories/{id}", {
                method: "delete",
                params: {id: CategoryStub("sport", "01")._id}
            });
            expect(store.getState().categories.categories).toEqual(
                [
                    CategoryStub("suv", "02")
                ]
            );
        })
    });

});