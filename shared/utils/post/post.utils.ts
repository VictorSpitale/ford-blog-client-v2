import {IPost, UpdatePost} from "../../types/post.type";

export const toUpdatePost = (post: IPost): UpdatePost => {
    return {
        sourceLink: post.sourceLink,
        desc: post.desc,
        sourceName: post.sourceName,
        title: post.title,
        categories: [],
    }
}