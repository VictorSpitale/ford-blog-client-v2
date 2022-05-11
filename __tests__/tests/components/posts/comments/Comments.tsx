import React, {memo, useEffect, useState} from 'react';
import {IPost} from "../../../../../shared/types/post.type";
import {IComment} from "../../../../../shared/types/comment.type";
import {useAppSelector} from "../../../../../context/hooks";
import Comment from "./Comment";

type PropsType = {
    post: IPost
}

const Comments = ({post}: PropsType) => {

    const [comments, setComments] = useState<IComment[]>([]);
    const [page, setPage] = useState(1);
    const {user} = useAppSelector(state => state.user);

    useEffect(() => {
        setComments([{
            comment: "salut",
            commenter: {
                pseudo: "Victor",
            },
            _id: "520",
            createdAt: "date",
            updatedAt: "date"
        }, {
            comment: "salut",
            commenter: {
                pseudo: "Victor",
            },
            _id: "520",
            createdAt: "date",
            updatedAt: "date"
        }]);
        // setComments(post.comments.slice(0, page * 2));
    }, [post, page])

    return (
        <div>
            <h1 className={"font-bold text-2xl"}>{comments.length} commentaire{comments.length > 1 && 's'}</h1>
            {comments.map((comment, index) => {
                return (
                    <>
                        <Comment key={index} comment={comment}/>
                        {index !== comments.length - 1 && <hr/>}
                    </>
                )
            })}
        </div>
    );
};
export default memo(Comments);