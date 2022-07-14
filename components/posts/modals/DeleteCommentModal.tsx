import React from 'react';
import {useTranslation} from "../../../shared/hooks";
import DeleteModal, {DeleteModalProps} from "../../modal/DeleteModal";
import {IUser} from "../../../shared/types/user.type";
import {IComment} from "../../../shared/types/comment.type";

type PropsType = {
    user: IUser;
    comment: IComment;
} & DeleteModalProps

const DeleteCommentModal = ({toggle, isShowing, handleDelete, pending, comment, user}: PropsType) => {

    const t = useTranslation();

    return (
        <DeleteModal isShowing={isShowing} toggle={toggle} handleDelete={handleDelete} pending={pending}>
            <p className={"text-justify"}>
                {t.posts.delete.before}
                <span className={"text-red-400 font-bold"}>
                            {t.common.delete}
                        </span>
                {comment.commenter._id === user._id ?
                    <>{t.posts.delete.ownComment}</>
                    :
                    <>{t.posts.delete.comment.replace("{{pseudo}}", comment.commenter.pseudo)}</>
                }
            </p>
        </DeleteModal>
    );
};

export default DeleteCommentModal;