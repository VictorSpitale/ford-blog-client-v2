import {postsReducer, PostsState} from "../../../../context/reducers/posts/posts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {
    commentPost,
    deletePost,
    deletePostComment,
    getPosts,
    updatePost,
    updatePostComment
} from "../../../../context/actions/posts/posts.actions";
import {IPaginatedPosts} from "../../../../shared/types/post.type";
import {PostStub} from "../../../stub/PostStub";
import {makeStore} from "../../../../context/store";
import * as fetch from "../../../../context/instance";
import {CommentStub} from "../../../stub/CommentStub";
import {deleteCategory, updateCategory} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../../context/actions/users/user.actions";
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";

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

    afterEach(() => {
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

    describe('updatePost', function () {

        it('should set pending true on updating', function () {
            const action: AnyAction = {
                type: updatePost.pending
            }
            const state = postsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: updatePost.rejected
            }
            const state = postsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false
            })
        });

        it('should set pending false and replace the post', function () {
            const action: AnyAction = {
                type: updatePost.fulfilled,
                payload: {...PostStub("01"), title: "newTitle"}
            }
            const state = postsReducer({
                ...initialState,
                pending: true,
                paginatedPosts: {...initialState.paginatedPosts, posts: [PostStub("01"), PostStub("02")]}
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [{...PostStub("01"), title: "newTitle"}, PostStub("02")]
                }
            })
        });

    });

    describe('deletePost', function () {

        it('should set pending true on deleting', function () {
            const action: AnyAction = {
                type: deletePost.pending
            }
            const state = postsReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: deletePost.rejected
            }
            const state = postsReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false
            })
        });

        it('should set pending false and delete the post', function () {
            const action: AnyAction = {
                type: deletePost.fulfilled,
                payload: "slug"
            }
            const state = postsReducer({
                ...initialState,
                pending: true,
                paginatedPosts: {
                    ...initialState.paginatedPosts, posts: [{
                        ...PostStub("01"), slug: "slug"
                    }, PostStub("02")]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [PostStub("02")]
                }
            })
        });

    });

    describe('CommentPost', function () {

        it('should add the comment if post is in the list', function () {
            const action: AnyAction = {
                type: commentPost.fulfilled,
                payload: {...PostStub("01"), comments: [CommentStub("01")]}
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), comments: []},
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), comments: [CommentStub("01")]},
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('DeleteComment', function () {

        it('should remove the comment if post is in the list', function () {
            const action: AnyAction = {
                type: deletePostComment.fulfilled,
                payload: {...PostStub("01"), comments: []},
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), comments: [CommentStub("01")]},
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), comments: []},
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('UpdateComment', function () {

        it('should update the comment if post is in the list', function () {
            const action: AnyAction = {
                type: updatePostComment.fulfilled,
                payload: {...PostStub("01"), comments: [{...CommentStub("01"), comment: "newComment"}]},
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), comments: [{...CommentStub("01"), comment: "oldComment"}]},
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), comments: [{...CommentStub("01"), comment: "newComment"}]},
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('UpdateCategory', function () {

        it('should update the category if related posts are in the list', function () {
            const action: AnyAction = {
                type: updateCategory.fulfilled,
                payload: CategoryStub("gt", "01")
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), categories: [CategoryStub("sport", "01"), CategoryStub("suv", "02")]},
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), categories: [CategoryStub("gt", "01"), CategoryStub("suv", "02")]},
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('DeleteCategory', function () {

        it('should remove the category if related posts are in the list', function () {
            const action: AnyAction = {
                type: deleteCategory.fulfilled,
                payload: CategoryStub("gt", "01")
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), categories: [CategoryStub("gt", "01"), CategoryStub("suv", "02")]},
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {...PostStub("01"), categories: [CategoryStub("suv", "02")]},
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('UpdateUser', function () {

        it('should update comment on user update', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub(), {
                                ...CommentStub("01"),
                                commenter: {...CommentStub("01").commenter, _id: "01", pseudo: "oldPseudo"}
                            }]
                        },
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub(), {
                                ...CommentStub("01"),
                                commenter: {...CommentStub("01").commenter, _id: "01", pseudo: "newPseudo"}
                            }]
                        },
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('DeleteAccount', function () {

        it('should remove comment on delete account', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub(), {
                                ...CommentStub("01"),
                                commenter: {...CommentStub("01").commenter, _id: "01"}
                            }]
                        },
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub()]
                        },
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('removePicture', function () {

        it('should remove commenter picture on remove picture', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: undefined}
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub(), {
                                ...CommentStub("01"),
                                commenter: {...CommentStub("01").commenter, _id: "01", picture: "link"}
                            }]
                        },
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub(), {
                                ...CommentStub("01"),
                                commenter: {...CommentStub("01").commenter, _id: "01", picture: undefined}
                            }]
                        },
                        PostStub("02")
                    ]
                }
            })
        });

    });

    describe('uploadPicture', function () {

        it('should add commenter picture on upload picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {_id: "01", picture: "link"}
            }
            const state = postsReducer({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub(), {
                                ...CommentStub("01"),
                                commenter: {...CommentStub("01").commenter, _id: "01", picture: undefined}
                            }]
                        },
                        PostStub("02")
                    ]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                paginatedPosts: {
                    ...initialState.paginatedPosts,
                    posts: [
                        {
                            ...PostStub("01"),
                            comments: [CommentStub(), {
                                ...CommentStub("01"),
                                commenter: {...CommentStub("01").commenter, _id: "01", picture: "link"}
                            }]
                        },
                        PostStub("02")
                    ]
                }
            })
        });

    });

});