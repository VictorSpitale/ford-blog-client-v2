import {IComment} from "./comment.type";
import {ICategory} from "./category.type";

export type IPost = {
    authorId?: string,
    categories: ICategory[],
    comments: IComment[],
    createdAt: string,
    desc: string,
    _id: string,
    likes: number,
    authUserLiked: boolean,
    picture: string,
    slug: string,
    sourceLink: string,
    sourceName: string,
    title: string
    updatedAt: string
}
export type IPaginatedPosts = {
    hasMore: boolean;
    posts: IPost[];
    page: number;
}

export type IBasicPost = {
    picture: string,
    slug: string,
    desc: string,
    title: string
}

// Use to loop for [key, value] of ICreatePost, [file, categories] omitted because it's checked later
export const getCreatePostKeys = () => {
    return ["desc", "slug", "title", "sourceLink", "sourceName"]
}

export type ICreatePost = {
    [key: string]: string | string[] | File
    categories: string[],
    desc: string,
    slug: string,
    sourceLink: string,
    sourceName: string,
    title: string,
    file: File
}

export enum LikeStatus {
    LIKE = "like",
    UNLIKE = "unlike"
}

export type UpdatePost = {
    title: string;
    desc: string;
    sourceName: string;
    sourceLink: string;
    categories: string[]
}

type commenterId = {
    commenterId: string;
};

export type DeletePostComment = commenterId & Pick<IPost, "slug"> & Pick<IComment, "_id">;

export type UpdatePostComment = commenterId & Pick<IPost, "slug"> & Pick<IComment, "_id"> & Pick<IComment, "comment">;

export type CreatePostComment = Pick<IPost, "slug"> & Pick<IComment, "comment">;