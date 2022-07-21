import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {
    CreatePostComment,
    DeletePostComment,
    ICreatePost,
    IPaginatedPosts,
    IPost,
    LikeStatus,
    UpdatePost,
    UpdatePostComment
} from "../../../shared/types/post.type";
import {toFormData} from "../../../shared/utils/object.utils";
import {fetchApi} from "../../instance";
import {NextPageContext} from "next";
import {Categorized} from "../../reducers/categories/categorizedPosts.reducer";
import {ICategory} from "../../../shared/types/category.type";

export const GET_POSTS = "GET_POSTS"
export const GET_POST = "GET_POST"
export const GET_LAST_POSTS = "GET_LAST_POSTS"
export const CHANGE_LIKE_STATUS = "CHANGE_LIKE_STATUS"
export const DELETE_POST = "DELETE_POST";
export const CLEAN_POST = "CLEAN_POST";
export const UPDATE_POST = "UPDATE_POST";
export const GET_LIKED_POSTS = "GET_LIKED_POSTS";
export const CLEAN_LIKED_POSTS = "CLEAN_LIKED_POSTS";
export const CREATE_POST = "CREATE_POST";

export const COMMENT_POST = "COMMENT_POST";
export const DELETE_POST_COMMENT = "DELETE_POST_COMMENT";
export const UPDATE_POST_COMMENT = "UPDATE_POST_COMMENT";
export const PATCH_LIKE = "PATCH_LIKE";
export const CATEGORIZED_POSTS = "CATEGORIZED_POSTS"

export const getLastPosts = createAsyncThunk<IPost[], void, { state: RootState }>(GET_LAST_POSTS, async () => {
    let response: IPost[] = []
    await fetchApi("/api/posts/last", {method: "get"}).then((res) => {
        response = res.data
    })
    return response
})

export const getPosts = createAsyncThunk<IPaginatedPosts, number | undefined, { state: RootState }>(GET_POSTS, async (page = 1, {getState}) => {
    const {paginatedPosts} = getState().posts
    if (paginatedPosts.page >= page) {
        return paginatedPosts;
    }
    let response = {} as IPaginatedPosts;
    await fetchApi("/api/posts", {method: "get", query: {page}}).then((res) => {
        response = res.data
    })
    return response
})

export const getCategorizedPosts = createAsyncThunk<Categorized, ICategory, { state: RootState }>(CATEGORIZED_POSTS, async (category, {getState}) => {
    const {posts} = getState().categorizedPosts
    const categorizedPosts = posts.find((list) => list.category === category);
    if (categorizedPosts && categorizedPosts.posts.length > 0) {
        return categorizedPosts;
    }
    const response: Categorized = {posts: [], category};
    await fetchApi("/api/posts/categorized/{category}", {
        method: "get",
        params: {category: category.name}
    }).then((res) => {
        response.posts = res.data;
    })
    return response;
})

interface getPostParams {
    slug: string,
    context: NextPageContext
}

export const getPost = createAsyncThunk<IPost, getPostParams, { state: RootState }>(GET_POST, async (attr) => {
    let response: IPost = {} as IPost
    let headers;
    /* istanbul ignore next */
    if (attr.context.req?.headers.cookie) {
        headers = {
            Cookie: attr.context.req.headers.cookie,
        }
    }
    await fetchApi("/api/posts/{slug}", {method: "get", params: {slug: attr.slug}, headers}).then((res) => {
        response = res.data
    })
    return response
})

interface changePostStatusParams {
    slug: string,
    status: LikeStatus,
}

export const changeLikeStatus = createAsyncThunk<number, changePostStatusParams>(CHANGE_LIKE_STATUS, async (attr) => {
    let response = 0
    await fetchApi(`/api/posts/${attr.status}/{slug}`, {
        method: "patch",
        params: {slug: attr.slug}
    }).then((res) => response = res.data);
    return response;
})

export const deletePost = createAsyncThunk<string, string, { state: RootState }>(DELETE_POST, async (slug) => {
    await fetchApi("/api/posts/{slug}", {method: "delete", params: {slug}});
    return slug;
})

export const cleanPost = createAction(CLEAN_POST);
export const cleanLikedPosts = createAction<string>(CLEAN_LIKED_POSTS);

export const updatePost = createAsyncThunk<IPost, UpdatePost & { slug: string }, { state: RootState }>(UPDATE_POST, async (update) => {
    let response: IPost = {} as IPost
    await fetchApi("/api/posts/{slug}", {
        method: "patch",
        params: {slug: update.slug},
        json: update
    }).then((res) => response = res.data)
    return response;
})

export const getLikedPosts = createAsyncThunk<{ posts: IPost[], userId: string }, string, { state: RootState }>(GET_LIKED_POSTS, async (id, {getState}) => {
    const {users} = getState().likedPosts;
    const found = users.find((u) => u.userId === id);
    if (found) {
        return found;
    }
    let response: IPost[] = []
    await fetchApi('/api/posts/liked/{id}', {method: "get", params: {id}}).then((res) => response = res.data)
    return {
        posts: response,
        userId: id
    };
})

export const createPost = createAsyncThunk<IPost, ICreatePost, { state: RootState }>(CREATE_POST, async (post, {rejectWithValue}) => {
    let response = {} as IPost;
    const json: ICreatePost = {} as ICreatePost;
    toFormData(post).forEach((value, key) => {
        json[key] = value;
    });

    // Ignore file type
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await fetchApi("/api/posts", {method: "post", json})
        .then(res => {
            response = res.data;
            return response;
        })
        .catch(res => {
            return rejectWithValue(res)
        })
    // return await instance.post('/posts', toFormData(post))
    //     .then(res => {
    //         response = res.data;
    //         return response;
    //     })
    //     .catch(res => {
    //         return rejectWithValue(res)
    //     })
})

export const deletePostComment = createAsyncThunk<IPost, DeletePostComment, { state: RootState }>(DELETE_POST_COMMENT, async (comment) => {
    let response = {} as IPost;
    await fetchApi("/api/posts/comment/{slug}", {
        method: "delete",
        params: {slug: comment.slug},
        json: {_id: comment._id, commenterId: comment.commenterId}
    }).then((res) => {
        response = res.data;
    })
    return response;
})

export const updatePostComment = createAsyncThunk<IPost, UpdatePostComment, { state: RootState }>(UPDATE_POST_COMMENT, async (comment) => {
    let response = {} as IPost;
    await fetchApi("/api/posts/comment/{slug}", {
        method: "patch",
        params: {slug: comment.slug},
        json: {_id: comment._id, commenterId: comment.commenterId, comment: comment.comment}
    }).then((res) => {
        response = res.data;
    })
    return response;
})

export const commentPost = createAsyncThunk<IPost, CreatePostComment, { state: RootState }>(COMMENT_POST, async (comment) => {
    let response = {} as IPost;
    await fetchApi("/api/posts/comment/{slug}", {
        method: "post",
        params: {slug: comment.slug},
        json: {comment: comment.comment}
    }).then((res) => {
        response = res.data;
    })
    return response;
})

export const patchLikeStatus = createAsyncThunk<boolean, string, { state: RootState }>(PATCH_LIKE, async (slug) => {
    let response = false;
    await fetchApi("/api/posts/isLiked/{slug}", {
        method: "get",
        params: {slug}
    }).then((res) => {
        response = res.data;
    })
    return response;
})