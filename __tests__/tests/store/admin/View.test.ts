import {adminViewReducer, AdminViewsState} from "../../../../context/reducers/admin/adminView.reducer";
import {AdminViews} from "../../../../shared/types/adminViews.type";
import {AnyAction} from "@reduxjs/toolkit";
import {setAdminView} from "../../../../context/actions/admin/admin.actions";

describe('ViewTest', function () {

    const initialState: AdminViewsState = {
        view: AdminViews.POSTS
    }

    it('should return the initial state', function () {
        expect(adminViewReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    it('should change the view', function () {
        const action: AnyAction = {type: setAdminView, payload: AdminViews.CATEGORIES};
        const state = adminViewReducer(initialState, action);
        expect(state).toEqual({...initialState, view: AdminViews.CATEGORIES})
    });

});