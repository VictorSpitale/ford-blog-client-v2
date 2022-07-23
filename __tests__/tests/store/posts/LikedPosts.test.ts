import {likedPostsReducer, LikedPostsState} from "../../../../context/reducers/posts/likedPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {cleanLikedPosts, deletePost, getLikedPosts} from "../../../../context/actions/posts/posts.actions";
import {PostStub} from "../../../stub/PostStub";
import * as fetch from "../../../../context/instance";
import {makeStore} from "../../../../context/store";
import {deleteCategory, updateCategory} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../../context/actions/users/user.actions";
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";
import {CommentStub} from "../../../stub/CommentStub";

describe('LikedPosts Actions & Reducers', function () {

    const initialState: LikedPostsState = {
        pending: false,
        error: false,
        users: []
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

        it('should set posts if user is not in the list yet', function () {
            const action: AnyAction = {
                type: getLikedPosts.fulfilled,
                payload: {posts: [PostStub()], userId: "id"}
            }
            const state = likedPostsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                users: [{posts: [PostStub()], userId: "id"}]
            })
        });

        it('should replace the posts if user is already in the list', function () {
            const action: AnyAction = {
                type: getLikedPosts.fulfilled,
                payload: {posts: [PostStub()], userId: "01"}
            }
            const state = likedPostsReducer({
                ...initialState,
                pending: true,
                users: [{posts: [], userId: "01"}, {posts: [PostStub()], userId: "02"}]
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                users: [{posts: [PostStub()], userId: "01"}, {posts: [PostStub()], userId: "02"}]
            })
        });

        it('should set pending false and set posts (action)', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: [PostStub()]})
            const store = makeStore();
            await store.dispatch(getLikedPosts("user id"));
            expect(spy).toHaveBeenCalled();
            expect(store.getState().likedPosts.users).toEqual([{posts: [PostStub()], userId: "user id"}]);
        });

        it('should return the cached posts', async function () {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: [PostStub()]})
            const store = makeStore();
            await store.dispatch(getLikedPosts("user id"));
            await store.dispatch(getLikedPosts("user id"));
            expect(spy).toHaveBeenCalledTimes(1);
            expect(store.getState().likedPosts.users).toEqual([{posts: [PostStub()], userId: "user id"}]);
        });

    });

    describe('cleanLikedPosts', function () {

        it('should clean the state', function () {
            const action: AnyAction = {
                type: cleanLikedPosts,
                payload: "id"
            }
            const state = likedPostsReducer({...initialState, users: [{posts: [PostStub()], userId: "id"}]}, action);
            expect(state).toEqual({
                ...initialState,
                users: []
            })
        });

    });

    describe('UpdateCategory', function () {

        it('should update posts on update category', function () {
            const action: AnyAction = {type: updateCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = likedPostsReducer({
                ...initialState,
                users: [
                    {
                        posts: [
                            {...PostStub(), categories: [CategoryStub(), CategoryStub("sport", "01")]},
                        ], userId: "11"
                    }
                ]
            }, action)
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        posts: [
                            {...PostStub(), categories: [CategoryStub(), CategoryStub("gt", "01")]},
                        ], userId: "11"
                    }
                ]
            })
        });

    });

    describe('DeleteCategory', function () {

        it('should update posts on delete category', function () {
            const action: AnyAction = {type: deleteCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = likedPostsReducer({
                ...initialState,
                users: [
                    {
                        posts: [
                            {...PostStub(), categories: [CategoryStub(), CategoryStub("gt", "01")]},
                        ], userId: "11"
                    }
                ]
            }, action)
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        posts: [
                            {...PostStub(), categories: [CategoryStub()]},
                        ], userId: "11"
                    }
                ]
            })
        });

    });

    describe('DeletePost', function () {

        it('should update post list on delete post', function () {
            const action: AnyAction = {type: deletePost.fulfilled, payload: "slug"}
            const state = likedPostsReducer({
                ...initialState,
                users: [
                    {
                        posts: [
                            PostStub(),
                            {...PostStub(), slug: "slug"}
                        ], userId: "11"
                    }
                ]
            }, action)
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        posts: [
                            PostStub()
                        ], userId: "11"
                    }
                ]
            })
        });

    });

    describe('removePicture', function () {

        it('should update the posts comment on remove picture', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: undefined}
            }
            const state = likedPostsReducer({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                                }]
                            },
                        ], userId: "11"
                    }
                ]
            }, action)
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                                }]
                            },
                        ], userId: "11"
                    }
                ]
            })
        });

    });

    describe('uploadPicture', function () {

        it('should update the posts comment on upload picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {_id: "01", picture: "link"}
            }
            const state = likedPostsReducer({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                                }]
                            },
                        ], userId: "11"
                    }
                ]
            }, action)
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                                }]
                            },
                        ], userId: "11"
                    }
                ]
            })
        });

    });

    describe('updateUser', function () {

        it('should update the posts comment on upload picture', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = likedPostsReducer({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", pseudo: "oldPseudo"}
                                }]
                            },
                        ], userId: "11"
                    }
                ]
            }, action)
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01", pseudo: "newPseudo"}
                                }]
                            },
                        ], userId: "11"
                    }
                ]
            })
        });

    });

    describe('deleteAccount', function () {

        it('should filter the posts and comment on delete account', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = likedPostsReducer({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub(), {
                                    ...CommentStub(),
                                    commenter: {...CommentStub().commenter, _id: "01"}
                                }]
                            },
                        ], userId: "11"
                    }, {
                        posts: [], userId: "01"
                    }
                ]
            }, action)
            expect(state).toEqual({
                ...initialState,
                users: [
                    {
                        posts: [
                            {
                                ...PostStub(),
                                comments: [CommentStub()]
                            },
                        ], userId: "11"
                    }
                ]
            })
        });

    });

});