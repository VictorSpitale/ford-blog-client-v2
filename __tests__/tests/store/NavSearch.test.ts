import {navSearchReducer, NavSearchReducer} from "../../../context/reducers/navSearch.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {setQuery} from "../../../context/actions/navSearch.actions";

describe('NavSearch Actions & Reducers', function () {

    const initialState: NavSearchReducer = {
        query: ''
    }

    it('should return the initial state', function () {
        expect(navSearchReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('setQuery', function () {
        const action: AnyAction = {
            type: setQuery,
            payload: {query: "query"}
        }
        const state = navSearchReducer(initialState, action);
        expect(state).toEqual({
            query: "query"
        })

    });

});