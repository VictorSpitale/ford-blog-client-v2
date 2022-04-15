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

export type ICreatePost = {
    authorId: string,
    categories: string[],
    desc: string,
    slug: string,
    sourceLink: string,
    sourceName: string,
    title: string,
    picture?: string
}

export enum LikeStatus {
    LIKE = "like",
    UNLIKE = "unlike"
}