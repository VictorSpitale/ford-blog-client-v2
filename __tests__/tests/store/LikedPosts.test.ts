import {likedPostsReducer, LikedPostsState} from "../../../context/reducers/likedPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {cleanLikedPosts, getLikedPosts} from "../../../context/actions/posts.actions";
import {PostStub} from "../../stub/PostStub";
import * as fetch from "../../../context/instance";
import {makeStore} from "../../../context/store";

describe('LikedPosts Actions & Reducers', function () {

    const initialState: LikedPostsState = {
        pending: false,
        error: false,
        posts: []
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return the initial state', function () {
        expect(likedPostsReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getLikedPosts', function () {

        it('should set pending true while fetching', function () {
            const action: AnyAction = {
                type: getLikedPosts.pending
            }
            const state = likedPostsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: getLikedPosts.rejected
            }
            const state = likedPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false
            })
        });

        it('should set pending false and set posts', function () {
            const action: AnyAction = {
                type: getLikedPosts.fulfilled,
                payload: [PostStub()]
            }
            const state = likedPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: [PostStub()]
            })
        });

        it('should set pending false and set posts (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: [PostStub()]})

            const store = makeStore();
            await store.dispatch(getLikedPosts("user id"));
            expect(spy).toHaveBeenCalled();
            expect(store.getState().likedPosts.posts).toEqual([PostStub()]);
        });

    });

    describe('cleanLikedPosts', function () {

        it('should clean the state', function () {
            const action: AnyAction = {
                type: cleanLikedPosts
            }
            const state = likedPostsReducer({...initialState, posts: [PostStub()]}, action);
            expect(state).toEqual({
                ...initialState,
                posts: []
            })
        });

    });

});