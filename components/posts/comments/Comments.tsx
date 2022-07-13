import React, {memo, useCallback, useEffect, useState} from 'react';
import {IPost} from "../../../shared/types/post.type";
import {IComment} from "../../../shared/types/comment.type";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import Comment from "./Comment";
import {isEmpty} from "../../../shared/utils/object.utils";
import {commentPost, deletePostComment, updatePostComment} from "../../../context/actions/posts.actions";
import {changeCurrentEditComment} from "../../../context/actions/commentEdit.actions";
import TextAreaField from "../../shared/TextAreaField";
import Button from "../../shared/Button";
import {useTranslation} from "../../../shared/hooks";
import {IUser} from "../../../shared/types/user.type";

type PropsType = {
    post: IPost;
    user: IUser;
    pending: boolean;
}

const Comments = ({post, user, pending}: PropsType) => {

    const [comments, setComments] = useState<IComment[]>(post.comments);
    const [error, setError] = useState('');
    const [commentValue, setCommentValue] = useState('');

    const {commentId: currentEditingCommentId} = useAppSelector(state => state.currentComment);

    const dispatch = useAppDispatch();

    const t = useTranslation();

    const onDelete = useCallback(async (comment: IComment) => {
        await dispatch(deletePostComment({
            slug: post.slug,
            _id: comment._id,
            commenterId: comment.commenter._id
        })).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return setError(t.common.tryLater);
            }
            setComments((prevState) => prevState.filter((com) => com._id !== comment._id));
        })
    }, [dispatch, post.slug, t.common.tryLater]);

    const onUpdate = useCallback(async (comment: IComment, newValue: string) => {
        await dispatch(updatePostComment({
            comment: newValue,
            _id: comment._id,
            commenterId: comment.commenter._id,
            slug: post.slug
        })).then((res) => {
            dispatch(changeCurrentEditComment({commentId: undefined}));
            /* istanbul ignore else */
            if (res.meta.requestStatus === "fulfilled") {
                const updatedPost = res.payload as IPost;
                const newComment = updatedPost.comments.find((com) => com._id === comment._id);
                /* istanbul ignore if */
                if (!newComment) return;
                setComments(prevState => prevState.map((com) => com._id === comment._id ? newComment : com));
            }
        })
    }, [dispatch, post.slug]);

    const handleSubmit = useCallback(async () => {
        if (isEmpty(commentValue.trim())) return;
        setError("");
        await dispatch(commentPost({
            comment: commentValue,
            slug: post.slug
        })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                setCommentValue("");
                const post = res.payload as IPost;
                setComments(post.comments);
                return;
            }
            setError(t.common.tryLater);
        })
    }, [commentValue, dispatch, post.slug, t.common.tryLater]);

    useEffect(() => {
        return () => {
            dispatch(changeCurrentEditComment({commentId: undefined}));
        }
    }, [dispatch])

    return (
        <div data-content={"comments"} className={pending ? "cursor-wait" : "cursor-default"}>
            <h1 className={"font-bold text-2xl pb-2"}>
                {t.posts.comment.title.replace('{{count}}', comments.length.toString()).replace('{{s}}', comments.length > 1 ? 's' : '')}
            </h1>

            {isEmpty(user) ? <p className={"pb-3"}>{t.posts.comment.shouldLogin}</p> :

                <div className={"pb-3 md:w-3/5"}>
                    <hr />
                    <h2 className={"text-lg font-semibold pt-2"}>{t.posts.comment.comment}</h2>
                    {error && <p className={"px-2 rounded bg-red-400 text-white"}>{error}</p>}
                    <TextAreaField rows={4} name={"new-comment"} value={commentValue}
                                   onChange={(e) => setCommentValue(e.target.value)} />
                    <div className={"flex justify-end"}>
                        <Button classes={"bg-green-500 hover:!bg-green-600"} text={t.common.send}
                                element={"button"} onClick={handleSubmit} />
                    </div>
                </div>

            }

            {comments.map((comment, index) => {
                return (
                    <div key={index}>
                        <Comment comment={comment} onDelete={onDelete} onUpdate={onUpdate}
                                 isEditing={currentEditingCommentId === comment._id} user={user} pending={pending} />
                        {index !== comments.length - 1 && <hr />}
                    </div>
                )
            })}
        </div>
    );
};
export default memo(Comments);