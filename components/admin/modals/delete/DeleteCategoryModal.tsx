import React, {useCallback} from 'react';
import DeleteModal, {DeleteModalProps} from "../../../modal/DeleteModal";
import {ICategory} from "../../../../shared/types/category.type";
import {useTranslation} from "../../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../../context/hooks";
import {deleteCategory} from "../../../../context/actions/categories/categories.actions";

type PropsType = Omit<DeleteModalProps, "pending" | "handleDelete"> & {
    category: ICategory
}

const DeleteCategoryModal = ({toggle, isShowing, category}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const {pending} = useAppSelector(state => state.categories);

    const handleDelete = useCallback(async () => {
        await dispatch(deleteCategory(category)).then(() => {
            toggle();
        });
    }, [category, dispatch, toggle]);

    return (
        <DeleteModal handleDelete={handleDelete} pending={pending} isShowing={isShowing} toggle={toggle}>
            <p className={"text-justify"}>{t.categories.delete.replace('{{name}}', category.name)}</p>
        </DeleteModal>
    );
};

export default DeleteCategoryModal;