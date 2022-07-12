import {
    Categorized,
    categorizedPostsReducer,
    CategorizedPostsType
} from "../../../context/reducers/categorizedPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {getCategorizedPosts} from "../../../context/actions/posts.actions";
import {PostStub} from "../../stub/PostStub";

describe('CategorizedPosts Actions & Reducers', function () {

    const initialState: CategorizedPostsType = {
        posts: [],
        error: false,
        pending: false
    }

    it('should return the initial state', function () {
        expect(categorizedPostsReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getCategorizedPosts', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: getCategorizedPosts.pending
            }
            const state = categorizedPostsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {type: getCategorizedPosts.rejected}
            const state = categorizedPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false
            })
        })

        it('should set pending false and set posts on fulfilled', function () {
            const posts = [PostStub()];
            const payload: Categorized = {
                category: "name",
                posts
            }
            const action: AnyAction = {
                type: getCategorizedPosts.fulfilled,
                payload: payload
            }
            const state = categorizedPostsReducer({
                ...initialState,
                pending: true
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: [payload]
            })
        });

        it('should set pending false and cached posts on fulfilled', function () {
            const posts = [PostStub()];
            const initialPosts: Categorized = {
                category: "name",
                posts
            }
            const payload: Categorized = {
                category: "second",
                posts
            }
            const action: AnyAction = {
                type: getCategorizedPosts.fulfilled,
                payload: payload
            }
            const state = categorizedPostsReducer({
                ...initialState,
                pending: true,
                posts: [initialPosts]
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: [initialPosts, payload]
            })
        });

        it('should set pending false and replace categorized posts list on fulfilled', function () {
            const posts = [PostStub()];
            const payloadPosts = [PostStub(), PostStub()];
            const initialPosts: Categorized = {
                category: "name",
                posts
            }
            const payload: Categorized = {
                category: "name",
                posts: payloadPosts
            }
            const action: AnyAction = {
                type: getCategorizedPosts.fulfilled,
                payload: payload
            }
            const state = categorizedPostsReducer({
                ...initialState,
                pending: true,
                posts: [initialPosts]
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: [payload]
            })
        });

    });

});