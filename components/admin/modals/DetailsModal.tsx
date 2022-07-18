import React from 'react';
import {AnyFunction} from "../../../shared/types/props.type";
import {IPost} from "../../../shared/types/post.type";
import {ICategory} from "../../../shared/types/category.type";
import {IUser} from "../../../shared/types/user.type";
import Modal from "../../modal/Modal";
import RenderIf from "../../shared/RenderIf";
import PostDetailsModalContent from "./PostDetailsModalContent";

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
    return (
        <Modal isShowing={isShowing} large={true} title={"Détails"} previous={previous} hide={toggle}
               hasPrevious={hasPrevious}>
            {otherModal ? otherModal :
                <>
                    <RenderIf condition={content.type === "posts"}>
                        <PostDetailsModalContent setOtherModal={setOtherModal} post={content.data as IPost} />
                    </RenderIf>
                </>
            }
        </Modal>
    );
};

export default DetailsModal;