import React from 'react';
import {useTranslation} from "../../../shared/hooks";
import DeleteModal, {DeleteModalProps} from "../../modal/DeleteModal";

const DeleteAccountModal = ({toggle, isShowing, handleDelete, pending}: DeleteModalProps) => {

    const t = useTranslation();

    return (
        <DeleteModal isShowing={isShowing} toggle={toggle} handleDelete={handleDelete} pending={pending}>
            <p className={"text-justify"}>{t.account.security.delete.warning}</p>
        </DeleteModal>
    );
};

export default DeleteAccountModal;