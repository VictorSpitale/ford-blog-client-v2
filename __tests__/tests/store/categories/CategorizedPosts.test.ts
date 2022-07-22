import {
    Categorized,
    categorizedPostsReducer,
    CategorizedPostsType
} from "../../../../context/reducers/categories/categorizedPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {getCategorizedPosts} from "../../../../context/actions/posts/posts.actions";
import {PostStub} from "../../../stub/PostStub";
import {makeStore} from "../../../../context/store";
import * as fetch from "../../../../context/instance";
import {CategoryStub} from "../../../stub/CategoryStub";

describe('CategorizedPosts Actions & Reducers', function () {

    const initialState: CategorizedPostsType = {
        posts: [],
        error: false,
        pending: false
    }

    afterEach(() => {
        jest.clearAllMocks();

    })

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
                category: CategoryStub(),
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
                category: CategoryStub("sport", "01"),
                posts
            }
            const payload: Categorized = {
                category: CategoryStub("suv", "02"),
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
                category: CategoryStub(),
                posts
            }
            const payload: Categorized = {
                category: CategoryStub(),
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

        it('should return the cached categorized posts', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: [PostStub()]
            });

            const store = makeStore();
            await store.dispatch(getCategorizedPosts(CategoryStub()));
            await store.dispatch(getCategorizedPosts(CategoryStub()));
            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState().categorizedPosts.posts).toEqual([{
                category: CategoryStub(),
                posts: [PostStub()]
            }])
        });

        it('should return the cached categorized posts and the new one', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: [PostStub()]
            }).mockResolvedValueOnce({
                data: []
            });

            const store = makeStore();
            await store.dispatch(getCategorizedPosts(CategoryStub("sport", "01")));
            await store.dispatch(getCategorizedPosts(CategoryStub("suv", "02")));
            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().categorizedPosts.posts).toEqual([{
                category: CategoryStub("sport", "01"),
                posts: [PostStub()]
            }, {
                category: CategoryStub("suv", "02"),
                posts: []
            }])
        });

    });

});