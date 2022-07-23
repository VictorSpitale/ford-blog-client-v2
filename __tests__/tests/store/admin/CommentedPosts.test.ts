import {
    adminCommentedPostsReducer,
    AdminCommentedPostsState
} from "../../../../context/reducers/admin/adminCommentedPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {getCommentedPostByUserId} from "../../../../context/actions/admin/admin.actions";
import {makeStore} from "../../../../context/store";
import * as fetch from "../../../../context/instance";
import {PostStub} from "../../../stub/PostStub";
import {deleteCategory, updateCategory} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";
import {deletePost} from "../../../../context/actions/posts/posts.actions";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../../context/actions/users/user.actions";
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";
import {CommentStub} from "../../../stub/CommentStub";

describe('CommentedPosts Actions & Reducers', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    const initialState: AdminCommentedPostsState = {
        pending: false,
        users: []
    }

    it('should return the initial state', function () {
        expect(adminCommentedPostsReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('getCommentedPostByUserId', function () {

        it('should set pending true while fetching', function () {
            const action: AnyAction = {type: getCommentedPostByUserId.pending}
            const state = adminCommentedPostsReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true});
        });

        it('should set pending false on reject', function () {
            const action: AnyAction = {type: getCommentedPostByUserId.rejected}
            const state = adminCommentedPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState);
        });

        it('should set pending false and posts on fulfilled', function () {
            const action: AnyAction = {
                type: getCommentedPostByUserId.fulfilled,
                payload: {userId: "01", posts: [PostStub("11")]}
            }
            const state = adminCommentedPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                users: [{userId: "01", posts: [PostStub("11")]}]
            })
        });

        it('should replace the posts if already fetched', function () {
            const action: AnyAction = {
                type: getCommentedPostByUserId.fulfilled,
                payload: {userId: "01", posts: [PostStub("11")]}
            }
            const state = adminCommentedPostsReducer({
                ...initialState,
                pending: true,
                users: [{userId: "01", posts: []}, {userId: "02", posts: [PostStub("12")]}]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [{userId: "01", posts: [PostStub("11")]}, {userId: "02", posts: [PostStub("12")]}]
            })
        });

        it('should fetch the commented posts and return the cached list', async function () {
            const store = makeStore();
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: [PostStub("11")]
            })
            await store.dispatch(getCommentedPostByUserId("01"));
            await store.dispatch(getCommentedPostByUserId("01"));
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('/api/users/{id}/comments', {method: "get", params: {id: "01"}});
            expect(store.getState().adminCommentedPosts).toEqual({
                ...initialState,
                users: [{userId: "01", posts: [PostStub("11")]}]
            });
        });

    });

    describe('updateCategory', function () {

        it('should replace the category on update', function () {
            const action: AnyAction = {type: updateCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = adminCommentedPostsReducer({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [{
                            ...PostStub(), categories:
                                [
                                    CategoryStub("sport", "01"),
                                    CategoryStub("suv", "02"),
                                ]
                        }]
                    }
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [{
                            ...PostStub(), categories:
                                [
                                    CategoryStub("gt", "01"),
                                    CategoryStub("suv", "02"),
                                ]
                        }]
                    }
                ]
            })
        });

    });

    describe('DeleteCategory', function () {

        it('should filter the categories on delete', function () {
            const action: AnyAction = {type: deleteCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = adminCommentedPostsReducer({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [{
                            ...PostStub(), categories:
                                [
                                    CategoryStub("gt", "01"),
                                    CategoryStub("suv", "02"),
                                ]
                        }]
                    }
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [{
                            ...PostStub(), categories:
                                [
                                    CategoryStub("suv", "02"),
                                ]
                        }]
                    }
                ]
            })
        });

    });

    describe('DeletePost', function () {

        it('should filter the posts on delete', function () {
            const action: AnyAction = {type: deletePost.fulfilled, payload: "slug"}
            const state = adminCommentedPostsReducer({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            PostStub("01"),
                            {...PostStub("02"), slug: "slug"}
                        ]
                    }
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            PostStub("01"),
                        ]
                    }
                ]
            })
        });

    });

    describe('RemovePicture', function () {

        it('should update the user on remove picture', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: undefined}
            }
            const state = adminCommentedPostsReducer({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                                }]
                            }
                        ]
                    }
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                                }]
                            }
                        ]
                    }
                ]
            })
        });

    });

    describe('UploadPicture', function () {

        it('should update the user on upload picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: "link"}
            }
            const state = adminCommentedPostsReducer({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                                }]
                            }
                        ]
                    }
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                                }]
                            }
                        ]
                    }
                ]
            })
        });

    });

    describe('UpdateUser', function () {

        it('should replace the user on user update', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = adminCommentedPostsReducer({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", pseudo: "oldPseudo"}
                                }]
                            }
                        ]
                    }
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        userId: "01", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", pseudo: "newPseudo"}
                                }]
                            }
                        ]
                    }
                ]
            })
        });

    });

    describe('DeleteAccount', function () {

        it('should filter the list and delete comments on delete account', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = adminCommentedPostsReducer({
                ...initialState,
                users: [
                    {userId: "01", posts: []},
                    {
                        userId: "02", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", pseudo: "oldPseudo"}
                                }]
                            }
                        ]
                    }
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        userId: "02", posts: [
                            {
                                ...PostStub("11"),
                                comments: [CommentStub()]
                            }
                        ]
                    }
                ]
            })
        });

    });

});