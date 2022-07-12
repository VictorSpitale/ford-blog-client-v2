import {postReducer, PostState} from "../../../context/reducers/post.reducer";
import {IPost, LikeStatus} from "../../../shared/types/post.type";
import {AnyAction} from "@reduxjs/toolkit";
import {
    changeLikeStatus,
    cleanPost,
    commentPost,
    deletePostComment,
    getPost,
    patchLikeStatus,
    updatePost,
    updatePostComment
} from "../../../context/actions/posts.actions";
import {PostStub} from "../../stub/PostStub";
import * as fetch from "../../../context/instance";
import {makeStore} from "../../../context/store";
import {NextPageContext} from "next";
import {CommentStub} from "../../stub/CommentStub";

describe('Post Actions & Reducers', function () {

    const initialState: PostState = {
        error: false,
        pending: false,
        post: {} as IPost
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return the initial state', function () {
        expect(postReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getPost', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: getPost.pending
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false and error true on rejected', function () {
            const action: AnyAction = {
                type: getPost.rejected
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                error: true
            })
        });

        it('should set pending false and set post on fulfilled', function () {
            const action: AnyAction = {
                type: getPost.fulfilled,
                payload: PostStub()
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                post: PostStub()
            })
        });

        it('should fetch post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: PostStub()})
            const store = makeStore();

            await store.dispatch(getPost({slug: PostStub().slug, context: {} as NextPageContext}));

            expect(spy).toHaveBeenCalled();
            expect(store.getState().post.post).toEqual(
                PostStub()
            );
        });

    });

    describe('changeLikeStatus', function () {

        it('should toggle like to the post on fulfilled', function () {
            const action: AnyAction = {
                type: changeLikeStatus.fulfilled,
                payload: 1
            }
            const state = postReducer({...initialState, post: PostStub()}, action);
            expect(state).toEqual({
                ...initialState,
                post: {...PostStub(), likes: 1, authUserLiked: true}
            })
        });

        it('should toggle like to the post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: PostStub()})
                .mockResolvedValueOnce({data: 1})

            const store = makeStore();
            await store.dispatch(getPost({slug: PostStub().slug, context: {} as NextPageContext}));

            await store.dispatch(changeLikeStatus({slug: PostStub().slug, status: LikeStatus.LIKE}));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().post.post).toEqual(
                {...PostStub(), likes: 1, authUserLiked: true}
            );
        });

    });

    describe('cleanPost', function () {

        it('should clear the actual post', function () {
            const action: AnyAction = {
                type: cleanPost,
            }
            const state = postReducer({...initialState, post: PostStub()}, action);
            expect(state).toEqual({
                ...initialState,
                post: {}
            })
        });

    });

    describe('UpdatePost', function () {
        // See also LastPost.test.ts

        it('should clear the actual post', function () {
            const action: AnyAction = {
                type: updatePost.rejected,
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                error: true
            })
        });

    });

    describe('deletePostComment', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: deletePostComment.pending
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: deletePostComment.rejected
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            })
        });

        it('should set pending false and remove comment from a post on fulfilled', function () {
            const action: AnyAction = {
                type: deletePostComment.fulfilled,
                payload: PostStub()
            }
            const state = postReducer({
                ...initialState,
                pending: true,
                post: {...PostStub(), comments: [CommentStub()]}
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                post: PostStub()
            })
        });

        it('should remove comment from post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: {...PostStub(), comments: [CommentStub()]}})
                .mockResolvedValueOnce({data: PostStub()})

            const store = makeStore();
            await store.dispatch(getPost({slug: PostStub().slug, context: {} as NextPageContext}));


            expect(store.getState().post.post).toEqual(
                {...PostStub(), comments: [CommentStub()]}
            );

            await store.dispatch(deletePostComment({
                slug: PostStub().slug,
                commenterId: CommentStub().commenter._id,
                _id: CommentStub()._id
            }));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().post.post).toEqual(
                PostStub()
            );
        });

    });

    describe('updatePostComment', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: updatePostComment.pending
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: updatePostComment.rejected
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            })
        });

        it('should set pending false and update comment from a post on fulfilled', function () {
            const action: AnyAction = {
                type: updatePostComment.fulfilled,
                payload: {...PostStub(), comments: [{...CommentStub(), comment: "nouveau"}]}
            }
            const state = postReducer({
                ...initialState,
                pending: true,
                post: {...PostStub(), comments: [CommentStub()]}
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                post: {...PostStub(), comments: [{...CommentStub(), comment: "nouveau"}]}
            })
        });

        it('should update comment from post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: {...PostStub(), comments: [CommentStub()]}})
                .mockResolvedValueOnce({data: {...PostStub(), comments: [{...CommentStub(), comment: "nouveau"}]}})

            const store = makeStore();
            await store.dispatch(getPost({slug: PostStub().slug, context: {} as NextPageContext}));


            expect(store.getState().post.post).toEqual(
                {...PostStub(), comments: [CommentStub()]}
            );

            await store.dispatch(updatePostComment({
                slug: PostStub().slug,
                _id: CommentStub()._id,
                commenterId: CommentStub().commenter._id,
                comment: "nouveau"
            }));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().post.post).toEqual(
                {...PostStub(), comments: [{...CommentStub(), comment: "nouveau"}]}
            );
        });

    });

    describe('commentPost', function () {

        it('should set pending true on fetching', function () {
            const action: AnyAction = {
                type: commentPost.pending
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: commentPost.rejected
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            })
        });

        it('should set pending false and comment a post on fulfilled', function () {
            const action: AnyAction = {
                type: commentPost.fulfilled,
                payload: {...PostStub(), comments: [CommentStub()]}
            }
            const state = postReducer({
                ...initialState,
                pending: true,
                post: PostStub()
            }, action);

            expect(state).toEqual({
                ...initialState,
                pending: false,
                post: {...PostStub(), comments: [CommentStub()]}
            })
        });

        it('should comment a post (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: PostStub()})
                .mockResolvedValueOnce({data: {...PostStub(), comments: [CommentStub()]}})

            const store = makeStore();
            await store.dispatch(getPost({slug: PostStub().slug, context: {} as NextPageContext}));

            expect(store.getState().post.post).toEqual(
                PostStub()
            );

            await store.dispatch(commentPost({
                slug: PostStub().slug,
                comment: CommentStub().comment
            }));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().post.post).toEqual(
                {...PostStub(), comments: [CommentStub()]}
            );
        });

    });

    describe('patchLikeStatus', function () {

        it('should fetch the auth like status', function () {
            const action: AnyAction = {
                type: patchLikeStatus.fulfilled,
                payload: true
            }
            const state = postReducer({
                ...initialState,
                post: PostStub()
            }, action);
            expect(state).toEqual({
                ...initialState,
                post: {...PostStub(), authUserLiked: true}
            })
        });

        it('should fetch the auth like status (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi")
                .mockResolvedValueOnce({data: PostStub()})
                .mockResolvedValueOnce({data: true})

            const store = makeStore();
            await store.dispatch(getPost({slug: PostStub().slug, context: {} as NextPageContext}));

            expect(store.getState().post.post).toEqual(
                PostStub()
            );

            await store.dispatch(patchLikeStatus(PostStub().slug));

            expect(spy).toHaveBeenCalledTimes(2);
            expect(store.getState().post.post).toEqual(
                {...PostStub(), authUserLiked: true}
            );
        });

    });

});