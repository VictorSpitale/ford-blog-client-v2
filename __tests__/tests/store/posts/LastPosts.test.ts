import {lastPostsReducer, PostsState} from "../../../../context/reducers/posts/lastPosts.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {createPost, deletePost, getLastPosts, updatePost} from "../../../../context/actions/posts/posts.actions";
import {PostStub} from "../../../stub/PostStub";
import * as fetch from "../../../../context/instance";
import {makeStore} from "../../../../context/store";
import {toUpdatePost} from "../../../../shared/utils/post/post.utils";
import {ICreatePost} from "../../../../shared/types/post.type";
import {deleteCategory, updateCategory} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../../context/actions/users/user.actions";
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";
import {CommentStub} from "../../../stub/CommentStub";

describe('LastPosts Actions & Reducers', function () {

    const initialState: PostsState = {
        posts: [],
        pending: false,
        error: false
    }


    afterEach(() => {
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

    describe('UpdateCategory', function () {

        it('should update the category if it is related to a post', function () {
            const action: AnyAction = {
                type: updateCategory.fulfilled,
                payload: CategoryStub("gt", "01")
            }
            const state = lastPostsReducer({
                ...initialState,
                posts: [PostStub(), {...PostStub(), categories: [CategoryStub("sport", "01")]}]
            }, action)
            expect(state).toEqual({
                ...initialState,
                posts: [
                    PostStub(),
                    {...PostStub(), categories: [CategoryStub("gt", "01")]}
                ]
            })
        });

    });

    describe('DeleteCategory', function () {

        it('should delete the category if it is related to a post', function () {
            const action: AnyAction = {
                type: deleteCategory.fulfilled,
                payload: CategoryStub("gt", "01")
            }
            const state = lastPostsReducer({
                ...initialState,
                posts: [PostStub(), {...PostStub(), categories: [CategoryStub("gt", "01")]}]
            }, action)
            expect(state).toEqual({
                ...initialState,
                posts: [
                    PostStub(),
                    {...PostStub(), categories: []}
                ]
            })
        });

    });

    describe('UpdateUser', function () {

        it('should update the post comment on update user', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "nouveau"}
            }
            const state = lastPostsReducer({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub(), {...CommentStub(), commenter: {_id: "01", pseudo: "ancien"}}]
                }]
            }, action)
            expect(state).toEqual({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub(), {...CommentStub(), commenter: {_id: "01", pseudo: "nouveau"}}]
                }]
            })
        });

    });

    describe('RemovePicture', function () {

        it('should update the post comment on remove picture', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: undefined}
            }
            const state = lastPostsReducer({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                    }]
                }]
            }, action)
            expect(state).toEqual({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                    }]
                }]
            })
        });

    });

    describe('UploadPicture', function () {

        it('should update the post comment on upload picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: "link"}
            }
            const state = lastPostsReducer({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                    }]
                }]
            }, action)
            expect(state).toEqual({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                    }]
                }]
            })
        });

    });

    describe('DeleteAccount', function () {

        it('should update the post comment on delete account', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = lastPostsReducer({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01"}
                    }]
                }]
            }, action)
            expect(state).toEqual({
                ...initialState,
                posts: [PostStub(), {
                    ...PostStub(),
                    comments: [CommentStub()]
                }]
            })
        });

    });

});