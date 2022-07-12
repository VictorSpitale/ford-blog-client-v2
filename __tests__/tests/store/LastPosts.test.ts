import {lastPostsReducer, PostsState} from "../../../context/reducers/lastPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {createPost, deletePost, getLastPosts, updatePost} from "../../../context/actions/posts.actions";
import {PostStub} from "../../stub/PostStub";
import * as fetch from "../../../context/instance";
import {makeStore} from "../../../context/store";
import {toUpdatePost} from "../../../shared/utils/post/post.utils";
import {ICreatePost} from "../../../shared/types/post.type";

describe('LastPosts Actions & Reducers', function () {

    const initialState: PostsState = {
        posts: [],
        pending: false,
        error: false
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return the initial state', function () {
        expect(lastPostsReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getLastPosts', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: getLastPosts.pending
            }
            const state = lastPostsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false and error true on rejected', function () {
            const action: AnyAction = {
                type: getLastPosts.rejected
            }
            const state = lastPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                error: true
            })
        });

        it('should set pending false and set posts on fulfilled', function () {
            const action: AnyAction = {
                type: getLastPosts.fulfilled,
                payload: [PostStub()]
            }
            const state = lastPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: [PostStub()]
            })
        });

        it('should fetch posts (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: [PostStub()]})
            const store = makeStore();

            await store.dispatch(getLastPosts());

            expect(spy).toHaveBeenCalled();
            expect(store.getState().lastPosts.posts).toEqual(
                [PostStub()]
            );
        });

    });

    describe('deletePost', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: deletePost.pending
            }
            const state = lastPostsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: deletePost.rejected
            }
            const state = lastPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            })
        });

        it('should set pending false and delete post on fulfilled', function () {
            const action: AnyAction = {
                type: deletePost.fulfilled,
                payload: PostStub().slug
            }
            const state = lastPostsReducer({...initialState, pending: true, posts: [PostStub()]}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: []
            })
        });

        it('should delete post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: [PostStub()]})
                .mockResolvedValueOnce({data: PostStub().slug});
            const store = makeStore();

            await store.dispatch(getLastPosts());

            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState().lastPosts.posts).toEqual(
                [PostStub()]
            );

            await store.dispatch(deletePost(PostStub().slug));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().lastPosts.posts).toEqual(
                []
            );
        });

    });

    describe('updatePost', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: updatePost.pending
            }
            const state = lastPostsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: updatePost.rejected
            }
            const state = lastPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            })
        });

        it('should set pending false and update post on fulfilled', function () {
            const action: AnyAction = {
                type: updatePost.fulfilled,
                payload: {
                    ...PostStub(),
                    title: "nouveau"
                }
            }
            const state = lastPostsReducer({...initialState, pending: true, posts: [PostStub()]}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: [{
                    ...PostStub(),
                    title: "nouveau"
                }]
            })
        });

        it('should update post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: [PostStub(), PostStub("autre")]})
                .mockResolvedValueOnce({
                    data: {
                        ...PostStub(),
                        title: "nouveau"
                    }
                });
            const store = makeStore();

            await store.dispatch(getLastPosts());

            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState().lastPosts.posts).toEqual(
                [PostStub(), PostStub("autre")]
            );

            await store.dispatch(updatePost({...toUpdatePost(PostStub()), title: "nouveau", slug: PostStub().slug}));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().lastPosts.posts).toEqual(
                [PostStub("autre"), {
                    ...PostStub(),
                    title: "nouveau"
                }]
            );
        });

    });

    describe('createPost', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: createPost.pending
            }
            const state = lastPostsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: createPost.rejected
            }
            const state = lastPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            })
        });

        it('should set pending false and create post on fulfilled', function () {
            const action: AnyAction = {
                type: createPost.fulfilled,
                payload: PostStub(),
            }
            const state = lastPostsReducer({...initialState, pending: true, posts: []}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                posts: [PostStub()]
            })
        });

        it('should create post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: PostStub()})
            const store = makeStore();

            const post = PostStub();
            await store.dispatch(createPost({
                categories: [],
                desc: post.desc,
                slug: post.slug,
                title: post.title,
                sourceLink: post.sourceLink,
                sourceName: post.sourceName,
                file: null
            } as unknown as ICreatePost));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState().lastPosts.posts).toEqual(
                [PostStub()]
            );

        });

        it('should fail to create post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockRejectedValue({})
            const store = makeStore();

            const post = PostStub();
            await store.dispatch(createPost({
                categories: [],
                desc: post.desc,
                slug: post.slug,
                title: post.title,
                sourceLink: post.sourceLink,
                sourceName: post.sourceName,
                file: null
            } as unknown as ICreatePost));

            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState().lastPosts.posts).toEqual(
                []
            );

        });

        it('should create post and pop the last one (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: [PostStub("0"), PostStub("1"), PostStub("2"), PostStub("3"), PostStub("4"), PostStub("5")]})
                .mockResolvedValueOnce({data: PostStub()})
            const store = makeStore();

            const post = PostStub();

            await store.dispatch(getLastPosts());

            expect(store.getState().lastPosts.posts[5]).toEqual(PostStub("5"));

            await store.dispatch(createPost({
                categories: [],
                desc: post.desc,
                slug: post.slug,
                title: post.title,
                sourceLink: post.sourceLink,
                sourceName: post.sourceName,
                file: null
            } as unknown as ICreatePost));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().lastPosts.posts[5]).not.toEqual(PostStub("5"));

        });

    });

});