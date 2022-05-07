import {categoriesReducer, CategoriesState} from "../../../context/reducers/categories.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {createCategory, getCategories} from "../../../context/actions/categories.actions";
import {CategoryStub} from "../../stub/CategoryStub";
import {makeStore} from "../../../context/store";
import {instance} from "../../../context/instance";

describe('Categories Reducer & Actions', function () {

    const initialState: CategoriesState = {
        categories: [], pending: false, error: false
    }

    it('should return the initialState', () => {
        expect(categoriesReducer(undefined, {} as AnyAction)).toEqual(initialState);
    })

    describe("Get Categories", () => {

        it('should fetch the categories', () => {
            const action: AnyAction = {
                type: getCategories.fulfilled, payload: [CategoryStub()]
            }
            const state = categoriesReducer(initialState, action);
            expect(state).toEqual({
                ...initialState, categories: [CategoryStub()]
            })
        })
        it('should fetch the categories (action)', async () => {
            const store = makeStore();
            const spy = jest.spyOn(instance, "get").mockResolvedValueOnce({
                data: [CategoryStub()]
            })
            await store.dispatch(getCategories());
            expect(spy).toHaveBeenCalledWith('/categories');
            expect(store.getState().categories.categories).toEqual([CategoryStub()]);
        })

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
            const action: AnyAction = {type: createCategory.fulfilled};
            const state = categoriesReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState, pending: false
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
            const spy = jest.spyOn(instance, "post").mockResolvedValueOnce({
                data: CategoryStub(name)
            });
            const store = makeStore();
            await store.dispatch(createCategory(name));
            expect(spy).toHaveBeenCalledWith("/categories", {name});
            expect(store.getState().categories.categories).toEqual([CategoryStub(name)]);
            spy.mockClear();
        })

        it('should create a category and add it to the categories (action)', async () => {
            const name = "mustang";
            const snName = "suv";
            const spy = jest.spyOn(instance, "post").mockResolvedValueOnce({
                data: CategoryStub(name)
            }).mockResolvedValueOnce({
                data: CategoryStub(snName)
            });
            const store = makeStore();
            await store.dispatch(createCategory(name));
            await store.dispatch(createCategory(snName));
            expect(spy).toHaveBeenNthCalledWith(1, "/categories", {name});
            expect(spy).toHaveBeenNthCalledWith(2, "/categories", {name: snName});
            expect(store.getState().categories.categories).toEqual([CategoryStub(name), CategoryStub(snName)]);
        })

    });

});