import {createReducer} from "@reduxjs/toolkit";
import {IPost} from "../../../shared/types/post.type";
import {getFilteredCommentedPostByUserId} from "../../actions/admin/admin.actions";
import {deleteCategory, updateCategory} from "../../actions/categories/categories.actions";
import {deletePost} from "../../actions/posts/posts.actions";
import {removePicture, updateUser, uploadPicture} from "../../actions/users/user.actions";

export type UserCommentedPosts = {
    posts: IPost[],
    userId: string
}

export type AdminCommentedPostsState = {
    pending: boolean;
    users: UserCommentedPosts[]
}
const initial: AdminCommentedPostsState = {
    pending: false,
    users: []
}

export const adminCommentedPostsReducer = createReducer(initial, (builder => {
    builder.addCase(getFilteredCommentedPostByUserId.pending, (state) => {
        state.pending = true;
    }).addCase(getFilteredCommentedPostByUserId.rejected, (state) => {
        state.pending = false;
    }).addCase(getFilteredCommentedPostByUserId.fulfilled, (state, {payload}) => {
        state.pending = false;
        const found = state.users.find((u) => u.userId === payload.userId);
        if (found) {
            state.users = state.users.map((u) => {
                if (u.userId === payload.userId) return payload;
                return u;
            })
        } else {
            state.users = [...state.users, payload];
        }
    }).addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            return {
                ...u,
                posts: u.posts.map((p) => {
                    return {
                        ...p,
                        categories: p.categories.map((cat) => {
                            if (cat._id === payload._id) return payload;
                            return cat;
                        })
                    }
                })
            }
        });
    }).addCase(deleteCategory.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            return {
                ...u,
                posts: u.posts.map((p) => {
                    return {
                        ...p,
                        categories: p.categories.filter((cat) => cat._id !== payload._id)
                    }
                })
            }
        });
    }).addCase(deletePost.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            return {
                ...u,
                posts: u.posts.filter((p) => p.slug !== payload)
            }
        });
    }).addCase(removePicture.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            return {
                ...u,
                posts: u.posts.map((p) => {
                    return {
                        ...p,
                        comments: p.comments.map((com) => {
                            if (com.commenter._id === payload._id) return {
                                ...com,
                                commenter: {...com.commenter, picture: undefined}
                            }
                            return com;
                        })
                    }
                })
            }
        })
    }).addCase(uploadPicture.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            return {
                ...u,
                posts: u.posts.map((p) => {
                    return {
                        ...p,
                        comments: p.comments.map((com) => {
                            if (com.commenter._id === payload._id) return {
                                ...com,
                                commenter: {...com.commenter, picture: payload.picture}
                            }
                            return com;
                        })
                    }
                })
            }
        })
    }).addCase(updateUser.fulfilled, (state, {payload}) => {
        state.users = state.users.map((u) => {
            return {
                ...u,
                posts: u.posts.map((p) => {
                    return {
                        ...p,
                        comments: p.comments.map((com) => {
                            if (com.commenter._id === payload._id) return {
                                ...com,
                                commenter: {...com.commenter, pseudo: payload.pseudo}
                            }
                            return com;
                        })
                    }
                })
            }
        })
    })
}))

export default adminCommentedPostsReducer;