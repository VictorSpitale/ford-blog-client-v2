import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {IComment} from "../../../shared/types/comment.type";
import defaultSrc from '../../../public/static/img/default-profile.png'
import ProfilePicture from "../../shared/ProfilePicture";
import {useAppDispatch} from "../../../context/hooks";
import Trash from "../../shared/icons/Trash";
import Edit from "../../shared/icons/Edit";
import {useTranslation} from "../../../shared/hooks";
import {getTimeSinceMsg, stringToDate, timeSince} from "../../../shared/utils/date.utils";
import {changeCurrentEditComment} from "../../../context/actions/commentEdit.actions";
import Button from "../../shared/Button";
import TextAreaField from "../../shared/TextAreaField";
import {IUser} from "../../../shared/types/user.type";

type PropsType = {
    comment: IComment;
    onDelete: (comment: IComment) => Promise<void>;
    onUpdate: (comment: IComment, newValue: string) => Promise<void>;
    isEditing: boolean;
    user: IUser;
}

const Comment = ({comment, onDelete, isEditing, onUpdate, user}: PropsType) => {

    const t = useTranslation();

    const [createdAt, setCreatedAt] = useState('');
    
    const dispatch = useAppDispatch();
    const editedCommentRef = useRef<HTMLTextAreaElement>(null);

    const handleDelete = useCallback(async () => {
        await onDelete(comment);
    }, [comment, onDelete]);

    const handleEdit = useCallback(() => {
        dispatch(changeCurrentEditComment({commentId: comment._id}));
    }, [comment, dispatch]);

    const handleCancel = useCallback(() => {
        dispatch(changeCurrentEditComment({commentId: undefined}));
    }, [dispatch]);

    const handleUpdate = useCallback(async () => {
        const value = editedCommentRef?.current?.value;
        if (!value || value === comment.comment) return;
        await onUpdate(comment, value);
    }, [comment, onUpdate]);

    useEffect(() => {
        setCreatedAt(getTimeSinceMsg(t, timeSince(stringToDate(comment.createdAt))))
    }, [comment, t]);

    return (
        <div className={"my-2"}>
            <div className={"flex gap-x-3"}>
                <ProfilePicture src={comment.commenter.picture || defaultSrc.src} />
                <div className={"flex flex-col"}>
                    <h3 className={"font-bold text-lg"}>{comment.commenter.pseudo}</h3>
                    <p>{createdAt}{comment.updatedAt ?
                        <span className={"italic text-xs"}> {t.posts.comment.modified}</span> : ''}</p>
                </div>
                {user._id === comment.commenter._id &&
					<div className={"flex flex-col justify-between"}>
						<Trash large={false} callback={handleDelete} />
						<Edit large={false} callback={handleEdit} />
					</div>
                }
            </div>
            {isEditing ?
                <div className={"p-2"}>
                    <TextAreaField name={"comment"} defaultValue={comment.comment} ref={editedCommentRef} rows={4} />
                    <div className={"flex justify-end gap-x-3"}>
                        <Button element={"button"} text={t.common.confirm} classes={"bg-green-500 hover:!bg-green-600"}
                                onClick={handleUpdate} />
                        <Button element={"button"} text={t.common.cancel} classes={"bg-red-500 hover:!bg-red-600"}
                                onClick={handleCancel} />
                    </div>
                </div>
                : <div className={"mt-2"}>{comment.comment.split(/\r\n|\r|\n/g).map((s, i) => {
                    return <p key={i}>{s}</p>
                })}</div>}
        </div>
    );
};

export default memo(Comment);