import React, {useCallback} from 'react';
import DeleteModal, {DeleteModalProps} from "../../../modal/DeleteModal";
import {useTranslation} from "../../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../../context/hooks";
import {IUser} from "../../../../shared/types/user.type";
import RenderIf from "../../../shared/RenderIf";
import {deleteAccount} from "../../../../context/actions/users/user.actions";

type PropsType = Omit<DeleteModalProps, "pending" | "handleDelete"> & {
    user: IUser
}

const DeleteUserModal = ({toggle, isShowing, user}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const {pending} = useAppSelector(state => state.users);
    const {user: loggedUser} = useAppSelector(state => state.user);

    const handleDelete = useCallback(async () => {
        /* istanbul ignore if */
        if (pending) return;
        await dispatch(deleteAccount(user)).then(() => {
            toggle();
        })
    }, [pending, dispatch, user, toggle]);

    return (
        <DeleteModal handleDelete={user._id === loggedUser._id ? undefined : handleDelete} pending={pending}
                     isShowing={isShowing} toggle={toggle}>
            <RenderIf condition={user._id === loggedUser._id}>
                <p className={"text-justify"}>{t.admin.users.cantDelete}</p>
            </RenderIf>
            <RenderIf condition={user._id !== loggedUser._id}>
                <p className={"text-justify"}>{t.admin.users.delete.replace('{{name}}', user.pseudo)}</p>
            </RenderIf>
        </DeleteModal>
    );
};

export default DeleteUserModal;