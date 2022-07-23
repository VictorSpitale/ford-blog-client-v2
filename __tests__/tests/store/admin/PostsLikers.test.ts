import {
    adminPostsLikersReducer,
    AdminPostsLikersState
} from "../../../../context/reducers/admin/adminPostsLikers.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {getPostLikers} from "../../../../context/actions/admin/admin.actions";
import {UserStub} from "../../../stub/UserStub";
import {makeStore} from "../../../../context/store";
import * as fetch from "../../../../context/instance";
import {deletePost} from "../../../../context/actions/posts/posts.actions";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../../context/actions/users/user.actions";
import {IUserRole} from "../../../../shared/types/user.type";

describe('PostsLikersTest Actions & Reducers', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    const initialState: AdminPostsLikersState = {
        posts: [],
        pending: false
    }

    it('should return the initial state', function () {
        expect(adminPostsLikersReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getPostsLikers', function () {

        it('should set pending true while fetching', function () {
            const action: AnyAction = {type: getPostLikers.pending}
            const state = adminPostsLikersReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true});
        });

        it('should set pending false on reject', function () {
            const action: AnyAction = {type: getPostLikers.rejected}
            const state = adminPostsLikersReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState);
        });

        it('should set pending false and posts on fulfilled', function () {
            const action: AnyAction = {type: getPostLikers.fulfilled, payload: {slug: "slug", likers: [UserStub()]}}
            const state = adminPostsLikersReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                posts: [
                    {slug: "slug", likers: [UserStub()]}
                ]
            })
        });

        it('should replace the likers if already fetched', function () {
            const action: AnyAction = {type: getPostLikers.fulfilled, payload: {slug: "slug", likers: [UserStub()]}}
            const state = adminPostsLikersReducer({
                ...initialState,
                pending: true,
                posts: [{slug: "slug", likers: []}, {slug: "autre", likers: []}]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [
                    {slug: "slug", likers: [UserStub()]},
                    {slug: "autre", likers: []}
                ]
            })
        });

        it('should fetch the likers and return the cached list', async function () {
            const store = makeStore();
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: []
            })
            await store.dispatch(getPostLikers("slug"));
            await store.dispatch(getPostLikers("slug"));
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('/api/posts/{slug}/likers', {method: "get", params: {slug: "slug"}});
            expect(store.getState().adminPostsLikers).toEqual({
                ...initialState,
                posts: [
                    {slug: "slug", likers: []}
                ]
            });
        });

    });

    describe('UploadPicture', function () {

        it('should update user on upload picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: "link"}
            }
            const state = adminPostsLikersReducer({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                {...UserStub(IUserRole.USER, "01"), picture: undefined},
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                {...UserStub(IUserRole.USER, "01"), picture: "link"},
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            })
        });

    });

    describe('DeletePost', function () {

        it('should filter the posts on delete post', function () {
            const action: AnyAction = {type: deletePost.fulfilled, payload: 'slug'}
            const state = adminPostsLikersReducer({
                ...initialState,
                posts: [
                    {slug: "autre", likers: []},
                    {slug: "slug", likers: []},
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [
                    {slug: "autre", likers: []},
                ]
            })
        });

    });

    describe('RemovePicture', function () {

        it('should update user on remove picture', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: undefined}
            }
            const state = adminPostsLikersReducer({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                {...UserStub(IUserRole.USER, "01"), picture: "link"},
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                {...UserStub(IUserRole.USER, "01"), picture: undefined},
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            })
        });

    });

    describe('UpdateUser', function () {

        it('should replace user on user update', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = adminPostsLikersReducer({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                {...UserStub(IUserRole.USER, "01"), pseudo: "oldPseudo"},
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"},
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            })
        });

    });

    describe('DeleteAccount', function () {

        it('should filter the likers on deleteAccount', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = adminPostsLikersReducer({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                UserStub(IUserRole.USER, "01"),
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [
                    {
                        slug: "slug", likers:
                            [
                                UserStub(IUserRole.USER, "02"),
                            ]
                    },
                ]
            })
        });

    });

});