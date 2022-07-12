import {categorySlideReducer, CategorySlideState} from "../../../context/reducers/categorySlide.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {setCategorySlide} from "../../../context/actions/categories.actions";
import {CategoryStub} from "../../stub/CategoryStub";

describe('CategorySlide Actions & Reducers', function () {

    const initialState: CategorySlideState = {
        category: undefined
    }

    it('should return the initialState', function () {
        expect(categorySlideReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('setCategorySlide', function () {

        it('should set the category slide', function () {
            const category = CategoryStub();
            const action: AnyAction = {
                type: setCategorySlide,
                payload: {category}
            }
            const state = categorySlideReducer(initialState, action);
            expect(state).toEqual({category})

        });

    });

});