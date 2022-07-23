import {postReducer, PostState} from "../../../../context/reducers/posts/post.reducer";
import {IPost, LikeStatus} from "../../../../shared/types/post.type";
import {AnyAction} from "@reduxjs/toolkit";
import {
    changeLikeStatus,
    cleanPost,
    commentPost,
    createPost,
    deletePostComment,
    getPost,
    patchLikeStatus,
    updatePost,
    updatePostComment
} from "../../../../context/actions/posts/posts.actions";
import {PostStub} from "../../../stub/PostStub";
import * as fetch from "../../../../context/instance";
import {makeStore} from "../../../../context/store";
import {NextPageContext} from "next";
import {CommentStub} from "../../../stub/CommentStub";
import {deleteCategory, updateCategory} from "../../../../context/actions/categories/categories.actions";
import {CategoryStub} from "../../../stub/CategoryStub";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../../context/actions/users/user.actions";
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";

describe('Post Actions & Reducers', function () {

    const initialState: PostState = {
        error: false,
        pending: false,
        post: {} as IPost
    }


    afterEach(() => {
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

    describe('createPost', function () {

        it('should set pending true on creating', function () {
            const action: AnyAction = {
                type: createPost.pending
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        });

        it('should set pending false on rejected', function () {
            const action: AnyAction = {
                type: createPost.rejected
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            })
        });

        it('should set pending false and set post on fulfilled', function () {
            const action: AnyAction = {
                type: createPost.fulfilled,
                payload: PostStub()
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                post: PostStub()
            })
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

        it('should set pending false and error true the actual post', function () {
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

        it('should set pending true on update', function () {
            const action: AnyAction = {
                type: updatePost.pending,
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true,
            })
        });

        it('should set pending false update the post', function () {
            const action: AnyAction = {
                type: updatePost.fulfilled,
                payload: {...PostStub("01"), title: "newTitle"}
            }
            const state = postReducer({
                ...initialState,
                pending: true,
                post: {...PostStub("01"), title: "oldTitle"}
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                post: {...PostStub("01"), title: "newTitle"}
            })
        });

        it('should not affect the state if it is empty', function () {
            const action: AnyAction = {
                type: updatePost.fulfilled,
                payload: {...PostStub("01"), title: "newTitle"}
            }
            const state = postReducer({...initialState, pending: true}, action);
            expect(state).toEqual({
                ...initialState,
                pending: false
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

    describe('UpdateCategory', function () {
        it('should not change the state if it is empty', function () {
            const action: AnyAction = {type: updateCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = postReducer(initialState, action);
            expect(state).toEqual(initialState);
        });

        it('should update the post categories', function () {
            const action: AnyAction = {type: updateCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = postReducer({
                ...initialState,
                post: {...PostStub(), categories: [CategoryStub(), CategoryStub("sport", "01")]}
            }, action);
            expect(state).toEqual({
                ...initialState,
                post: {...PostStub(), categories: [CategoryStub(), CategoryStub("gt", "01")]}
            })
        });
    });

    describe('DeleteCategory', function () {
        it('should not change the state if it is empty', function () {
            const action: AnyAction = {type: deleteCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = postReducer(initialState, action);
            expect(state).toEqual(initialState);
        });

        it('should update the post categories', function () {
            const action: AnyAction = {type: deleteCategory.fulfilled, payload: CategoryStub("gt", "01")}
            const state = postReducer({
                ...initialState,
                post: {...PostStub(), categories: [CategoryStub(), CategoryStub("gt", "01")]}
            }, action);
            expect(state).toEqual({
                ...initialState,
                post: {...PostStub(), categories: [CategoryStub()]}
            })
        });
    });

    describe('UpdateUser', function () {
        it('should not change the state if it is empty', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual(initialState);
        });

        it('should update the post comments on user update', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = postReducer({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", pseudo: "oldPseudo"}
                    }]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", pseudo: "newPseudo"}
                    }]
                }
            })
        });
    });

    describe('removePicture', function () {
        it('should not change the state if it is empty', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual(initialState);
        });

        it('should update the post comments on remove picture', function () {
            const action: AnyAction = {
                type: removePicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: undefined}
            }
            const state = postReducer({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                    }]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                    }]
                }
            })
        });
    });

    describe('uploadPicture', function () {
        it('should not change the state if it is empty', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {_id: "01", picture: "link"}
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual(initialState);
        });

        it('should update the post comments on upload picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {_id: "01", picture: "link"}
            }
            const state = postReducer({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: undefined}
                    }]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01", picture: "link"}
                    }]
                }
            })
        });
    });

    describe('deleteAccount', function () {
        it('should not change the state if it is empty', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = postReducer(initialState, action);
            expect(state).toEqual(initialState);
        });

        it('should update the post comments on delete account', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled,
                payload: UserStub(IUserRole.USER, "01")
            }
            const state = postReducer({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub(), {
                        ...CommentStub(),
                        commenter: {...CommentStub().commenter, _id: "01"}
                    }]
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                post: {
                    ...PostStub(),
                    comments: [CommentStub()]
                }
            })
        });
    });

});