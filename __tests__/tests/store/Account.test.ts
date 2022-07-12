import {accountViewReducer, AccountViewType} from "../../../context/reducers/accountView.reducer";
import {AccountViews} from "../../../shared/types/accountViews.type";
import {AnyAction} from "@reduxjs/toolkit";
import {setView} from "../../../context/actions/account.actions";

describe('Account view Actions & Reducers', function () {

    const initialState: AccountViewType = {
        view: AccountViews.PROFILE
    }

    it('should return the initialState', function () {
        expect(accountViewReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('SetView', function () {

        const action: AnyAction = {
            type: setView,
            payload: AccountViews.LIKES
        }
        const state = accountViewReducer(initialState, action);
        expect(state).toEqual({
            view: AccountViews.LIKES
        })

    });

});