import React from 'react';
import {AnyFunction} from "../../../shared/types/props.type";
import {IPost} from "../../../shared/types/post.type";
import {ICategory} from "../../../shared/types/category.type";
import {IUser} from "../../../shared/types/user.type";
import Modal from "../../modal/Modal";
import RenderIf from "../../shared/RenderIf";
import PostDetailsModalContent from "./PostDetailsModalContent";
import {useTranslation} from "../../../shared/hooks";

type PropsType = {
    isShowing: boolean;
    toggle: AnyFunction;
    content: {
        type: "users" | "categories" | "posts",
        data: IUser | ICategory | IPost
    };
    otherModal: JSX.Element | undefined;
    setOtherModal: AnyFunction;
    hasPrevious: boolean;
    previous: AnyFunction;
}

const DetailsModal = ({
                          otherModal,
                          setOtherModal,
                          content,
                          previous,
                          hasPrevious,
                          toggle,
                          isShowing,
                      }: PropsType) => {

    const t = useTranslation();

    return (
        <Modal isShowing={isShowing} large={true} title={t.admin.details} previous={previous} hide={toggle}
               hasPrevious={hasPrevious}>
            <RenderIf condition={!!otherModal}>
                {otherModal}
            </RenderIf>
            <RenderIf condition={!otherModal}>
                <RenderIf condition={content.type === "posts"}>
                    <PostDetailsModalContent setOtherModal={setOtherModal} post={content.data as IPost} />
                </RenderIf>
            </RenderIf>
        </Modal>
    );
};

export default DetailsModal;