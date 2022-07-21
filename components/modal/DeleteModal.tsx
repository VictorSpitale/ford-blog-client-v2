import React from 'react';
import {AnyFunction, Children} from "../../shared/types/props.type";
import {useTranslation} from "../../shared/hooks";
import Modal from "./Modal";
import Cross from "../shared/icons/Cross";
import {capitalize} from "../../shared/utils/string.utils";
import RenderIf from "../shared/RenderIf";

type PropsType = {
    isShowing: boolean;
    toggle: AnyFunction;
    handleDelete?: AnyFunction;
    pending: boolean;
    children: Children
}

export type DeleteModalProps = Omit<PropsType, "children">;

const DeleteModal = ({handleDelete, toggle, isShowing, pending, children}: PropsType) => {
    const t = useTranslation();

    return (
        <Modal hide={toggle} isShowing={isShowing}>
            <div className={"flex justify-center"}>
                <Cross />
            </div>
            <div className={"p-5"}>
                <p className={"text-red-500 text-2xl font-extrabold text-center"}>{t.common.warning}</p>

                {children}

                <div className={"flex justify-around pt-3"}>
                    <RenderIf condition={!!handleDelete}>
                        <button onClick={handleDelete} role={"button"}
                                className={"px-5 py-2 rounded text-white bg-red-500"}>{pending ? t.common.deleting : capitalize(t.common.delete)}
                        </button>
                    </RenderIf>
                    <button onClick={toggle}
                            className={"px-5 py-2 rounded bg-gray-300"}>{t.common.cancel}</button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;