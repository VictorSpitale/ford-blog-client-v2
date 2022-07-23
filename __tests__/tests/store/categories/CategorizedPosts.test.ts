import {
    Categorized,
    categorizedPostsReducer,
    CategorizedPostsType
} from "../../../../context/reducers/categories/categorizedPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {deletePost, getCategorizedPosts} from "../../../../context/actions/posts/posts.actions";
import {PostStub} from "../../../stub/PostStub";
import {makeStore} from "../../../../context/store";
import * as fetch from "../../../../context/instance";
import {CategoryStub} from "../../../stub/CategoryStub";
import {deleteCategory, updateCategory} from "../../../../context/actions/categories/categories.actions";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../../context/actions/users/user.actions";
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";
import {CommentStub} from "../../../stub/CommentStub";

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

    describe('UpdateCategory', function () {

        it('should update the category list and related posts categories', function () {
            const action: AnyAction = {type: updateCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = categorizedPostsReducer({
                ...initialState,
                posts: [{
                    category: CategoryStub("sport", "01"),
                    posts: []
                }, {
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {...PostStub(), categories: [CategoryStub("sport", "01"), CategoryStub("suv", "02")]}
                    ]
                }]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [{
                    category: CategoryStub("gt", "01"),
                    posts: []
                }, {
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {...PostStub(), categories: [CategoryStub("gt", "01"), CategoryStub("suv", "02")]}
                    ]
                }]
            })
        });

    });

    describe('DeleteCategory', function () {

        it('should delete the category list and related posts categories', function () {
            const action: AnyAction = {type: deleteCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = categorizedPostsReducer({
                ...initialState,
                posts: [{
                    category: CategoryStub("sport", "01"),
                    posts: []
                }, {
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {...PostStub(), categories: [CategoryStub("sport", "01"), CategoryStub("suv", "02")]}
                    ]
                }]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {...PostStub(), categories: [CategoryStub("suv", "02")]}
                    ]
                }]
            })
        });

    });


    describe('DeletePost', function () {

        it('should filter the categorized posts list', function () {
            const action: AnyAction = {type: deletePost.fulfilled, payload: "slug"}
            const state = categorizedPostsReducer({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        PostStub(),
                        {...PostStub(), slug: "slug"}
                    ]
                }]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        PostStub()
                    ]
                }]
            })
        });

    });

    describe('UpdateUser', function () {

        it('should update the categorized posts comments', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = categorizedPostsReducer({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub(), {
                                ...CommentStub(),
                                commenter: {...CommentStub().commenter, _id: "01", pseudo: "oldPseudo"}
                            }]
                        }
                    ]
                }]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub(), {
                                ...CommentStub(),
                                commenter: {...CommentStub().commenter, _id: "01", pseudo: "newPseudo"}
                            }]
                        }
                    ]
                }]
            })
        });

    });

    describe('removePicture', function () {

        it('should update the categorized posts comments by removing the picture', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: undefined}
            }
            const state = categorizedPostsReducer({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub(), {
                                ...CommentStub(),
                                commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                            }]
                        }
                    ]
                }]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub(), {
                                ...CommentStub(),
                                commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                            }]
                        }
                    ]
                }]
            })
        });
    });

    describe('UploadPicture', function () {

        it('should update the categorized posts comments by adding the picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {_id: "01", picture: "link"}
            }
            const state = categorizedPostsReducer({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub(), {
                                ...CommentStub(),
                                commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                            }]
                        }
                    ]
                }]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub(), {
                                ...CommentStub(),
                                commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                            }]
                        }
                    ]
                }]
            })
        });

    });

    describe('DeleteAccount', function () {

        it('should filter the categorized posts comments', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = categorizedPostsReducer({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub(), {
                                ...CommentStub(),
                                commenter: {...CommentStub().commenter, _id: "01"}
                            }]
                        }
                    ]
                }]
            }, action);
            expect(state).toEqual({
                ...initialState,
                posts: [{
                    category: CategoryStub("suv", "02"),
                    posts: [
                        {
                            ...PostStub(),
                            comments: [CommentStub()]
                        }
                    ]
                }]
            })
        });

    });


});