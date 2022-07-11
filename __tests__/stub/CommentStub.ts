import {IComment} from "../../shared/types/comment.type";
import {UserStub} from "./UserStub";

export const CommentStub = (id = "62cc3af35cb8d215944a7175"): IComment => {
    return {
        comment: "commentaire",
        createdAt: 1657551603141,
        commenter: {
            _id: UserStub()._id,
            pseudo: UserStub().pseudo
        },
        _id: id
    }
}

