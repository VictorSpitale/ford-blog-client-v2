import {errorsReducer, ErrorState, ErrorStateType} from "../../../context/reducers/errors.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {setError} from "../../../context/actions/errors.actions";

describe('Errors Actions & Reducers', function () {

    const initialState: ErrorState = {
        securityViewError: "",
        profileViewError: "",
        writePageError: ""
    }

    it('should return the initial state', function () {
        expect(errorsReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('setError', function () {

        it('should set error', function () {

            const action: AnyAction = {
                type: setError,
                payload: {key: "profileViewError", error: "erreur"} as ErrorStateType
            }
            const state = errorsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                profileViewError: "erreur"
            })

        });

    });

});