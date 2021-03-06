import {
    selectCategoriesReducer,
    SelectCategoriesState
} from "../../../../context/reducers/categories/selectCategories.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {
    addSelectedCategories,
    removeSelectedCategories,
    setSelectedCategories
} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";

describe('Selected Categories Reducer & Actions', function () {

    const initialState: SelectCategoriesState = {
        categories: []
    }

    it('should return the initial state', () => {
        expect(selectCategoriesReducer(undefined, {} as AnyAction)).toEqual(initialState);
    })

    describe('setCategory', function () {

        it('should set categories', () => {
            const payload = [CategoryStub(), CategoryStub("mustang")];
            const action: AnyAction = {
                type: setSelectedCategories, payload
            }
            const state = selectCategoriesReducer(initialState, action);
            expect(state.categories).toEqual(payload)
        })

    });

    describe('addCategory', function () {

        it('should add a category', () => {
            const action: AnyAction = {
                type: addSelectedCategories, payload: CategoryStub("mustang")
            }
            const state = selectCategoriesReducer({categories: []}, action);
            expect(state.categories).toEqual([CategoryStub('mustang')])
        })

        it('should add a category to the previous ones', function () {
            const action: AnyAction = {
                type: addSelectedCategories, payload: CategoryStub("mustang")
            }
            const state = selectCategoriesReducer({categories: [CategoryStub()]}, action);
            expect(state.categories).toEqual([CategoryStub(), CategoryStub('mustang')])
        });

    });

    describe('removeCategory', function () {

        it('should remove a category', () => {
            const action: AnyAction = {
                type: removeSelectedCategories, payload: CategoryStub()
            }
            const state = selectCategoriesReducer({categories: [CategoryStub()]}, action);
            expect(state).toEqual(initialState);
        })

    });

});