import {IComment} from "./comment.type";

export type IPost = {
    authorId?: string,
    categories: string[],
    comments: IComment[],
    createdAt: string,
    desc: string,
    _id: string,
    likers: string[],
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