import React from 'react';
import {IPost} from "../../../shared/types/post.type";
import {useTranslation} from "../../../shared/hooks";
import DeleteModal, {DeleteModalProps} from "../../modal/DeleteModal";

const DeletePostModal = ({toggle, isShowing, handleDelete, pending, post}: DeleteModalProps & { post: IPost }) => {

    const t = useTranslation();

    return (
        <DeleteModal isShowing={isShowing} toggle={toggle} handleDelete={handleDelete} pending={pending}>
            <p className={"text-justify"}>
                {t.posts.delete.before}
                <span className={"text-red-400 font-bold"}>
                            {t.common.delete}
                        </span>
                {t.posts.delete.after}
                <span className={"underline"}>{post.title}</span>
            </p>
        </DeleteModal>
    );
};

export default DeletePostModal;