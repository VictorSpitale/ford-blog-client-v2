import React from 'react';
import Cross from "../../shared/icons/Cross";
import {capitalize} from "../../../shared/utils/string.utils";
import Modal from "../../modal/Modal";
import {cleanPost, deletePost} from "../../../context/actions/posts.actions";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {useRouter} from "next/router";
import {IPost} from "../../../shared/types/post.type";
import {AnyFunction} from "../../../shared/types/props.type";
import {useTranslation} from "../../../shared/hooks";

const DeletePostModal = ({post, toggle, isShowing}: { post: IPost, toggle: AnyFunction, isShowing: boolean }) => {
    const {pending} = useAppSelector(state => state.lastPosts)
    const dispatch = useAppDispatch();

    const t = useTranslation();
    const router = useRouter();

    const handleDelete = async () => {
        await dispatch(deletePost(post.slug)).then(async () => {
            await router.push("/");
            await dispatch(cleanPost());
        })
    }
    return (
        <Modal hide={toggle} isShowing={isShowing}>
            <div className={"flex justify-center"}>
                <Cross />
            </div>
            <div className={"p-5"}>
                <p className={"text-red-500 text-2xl font-extrabold text-center"}>{t.common.warning}</p>
                <p className={"text-justify"}>{t.posts.delete.before}
                    <span className={"text-red-400 font-bold"}>
                            {t.posts.delete.deleteAction}
                        </span>
                    {t.posts.delete.after}
                    <span className={"underline"}>{post.title}</span>
                </p>

                <div className={"flex justify-around pt-3"}>
                    <button onClick={handleDelete}
                            className={"px-5 py-2 rounded text-white bg-red-500"}>{pending ? t.posts.delete.deleteLoading : capitalize(t.posts.delete.deleteAction)}
                    </button>
                    <button onClick={toggle}
                            className={"px-5 py-2 rounded bg-gray-300"}>{t.posts.delete.cancel}</button>
                </div>
            </div>
        </Modal>
    );
};

export default DeletePostModal;