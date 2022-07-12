import {postsReducer, PostsState} from "../../../context/reducers/posts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {getPosts} from "../../../context/actions/posts.actions";
import {IPaginatedPosts} from "../../../shared/types/post.type";
import {PostStub} from "../../stub/PostStub";
import {makeStore} from "../../../context/store";
import * as fetch from "../../../context/instance";

describe('Posts Actions & Reducers', function () {

    const initialState: PostsState = {
        error: false,
        pending: false,
        paginatedPosts: {
            posts: [],
            hasMore: true,
            page: 0
        }
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return the initial state', function () {
        expect(postsReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getPosts', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: getPosts.pending
            }
            const state = postsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: getPosts.rejected
            }
            const state = postsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false
            })
        });

        it('should set pending false and first page', function () {
            const payload: IPaginatedPosts = {
                page: 1,
                hasMore: true,
                posts: [PostStub()]
            }
            const action: AnyAction = {
                type: getPosts.fulfilled,
                payload
            }
            const state = postsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                paginatedPosts: payload
            })
        });

        it('should set pending false and set two pages', function () {
            const initial: IPaginatedPosts = {
                page: 1,
                hasMore: true,
                posts: [PostStub()]
            }
            const payload: IPaginatedPosts = {
                page: 2,
                hasMore: false,
                posts: [PostStub(), PostStub("61ae1fc5406b7e0020edd21c")]
            }
            const action: AnyAction = {
                type: getPosts.fulfilled,
                payload
            }
            const state = postsReducer({...initialState, paginatedPosts: initial}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                paginatedPosts: payload
            })
        });

        it('should fetch two pages then not fetch on cached pages', async function () {
            const store = makeStore();
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: {
                    page: 2,
                    hasMore: true,
                    posts: [PostStub(), PostStub("61ae1fc5406b7e0020edd21c")]
                }
            })

            await store.dispatch(getPosts(2));
            await store.dispatch(getPosts());

            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState().posts).toEqual({
                ...initialState,
                paginatedPosts: {
                    page: 2,
                    hasMore: true,
                    posts: [PostStub(), PostStub("61ae1fc5406b7e0020edd21c")]
                }
            })
        });

    });

});