import {firstHydrateReducer, FirstHydrateReducer, HydrateStatus} from "../../../context/reducers/firstHydrate.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {changeStatus} from "../../../context/actions/firstHydrate.actions";
import {makeStore} from "../../../context/store";

describe('First Hydrate Reducer & Actions', function () {

    const initialState: FirstHydrateReducer = {
        status: HydrateStatus.BEFORE
    }

    it('should return the initial state', () => {
        expect(firstHydrateReducer(undefined, {} as AnyAction)).toEqual(initialState);
    })

    it('should change the state before to first', () => {
        const action = {type: changeStatus.fulfilled, payload: HydrateStatus.FIRST};
        const state = firstHydrateReducer(initialState, action);
        expect(state).toEqual({
            status: HydrateStatus.FIRST
        })
    })

    it('should change the state first to more', () => {
        const action = {type: changeStatus.fulfilled, payload: HydrateStatus.MORE};
        const state = firstHydrateReducer({status: HydrateStatus.BEFORE}, action);
        expect(state).toEqual({
            status: HydrateStatus.MORE
        })
    })

    it('should return the initial state (action)', () => {
        const store = makeStore();
        expect(store.getState().hydrateStatus).toEqual(initialState);
    })

    it('should change the state before to first (action)', async () => {
        const store = makeStore();
        await store.dispatch(changeStatus());
        expect(store.getState().hydrateStatus).toEqual({
            status: HydrateStatus.FIRST
        })
    })

    it('should change the state first to more (action)', async () => {
        const store = makeStore();
        await store.dispatch(changeStatus());
        await store.dispatch(changeStatus());
        expect(store.getState().hydrateStatus).toEqual({
            status: HydrateStatus.MORE
        })
    })

});