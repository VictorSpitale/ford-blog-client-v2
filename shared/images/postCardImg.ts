import {IPost} from "../types/post.type";

import pic from '../../tests/stub/ford-f-100-eluminator-concept.jpg'

export const getPostCardImg = (post: IPost): string => {
    if (process.env.NODE_ENV !== "development") {
        return post.picture
    }
    return pic.src
}