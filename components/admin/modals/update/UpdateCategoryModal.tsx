import React, {useCallback, useRef, useState} from 'react';
import {ICategory} from "../../../../shared/types/category.type";
import {AnyFunction} from "../../../../shared/types/props.type";
import {useTranslation} from "../../../../shared/hooks";
import Modal from "../../../modal/Modal";
import InputField from "../../../shared/InputField";
import Button from "../../../shared/Button";
import {useAppDispatch, useAppSelector} from "../../../../context/hooks";
import {updateCategory} from "../../../../context/actions/categories/categories.actions";
import {HttpError} from "../../../../shared/types/httpError.type";
import ErrorMessage from "../../../shared/ErrorMessage";

type PropsType = {
    isShowing: boolean;
    toggle: AnyFunction;
    category: ICategory;
}

const UpdateCategoryModal = ({toggle, isShowing, category}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const nameRef = useRef<HTMLInputElement>(null);

    const {pending} = useAppSelector(state => state.categories);

    const [error, setError] = useState('');

    const handleEdit = useCallback(async () => {
        setError('');
        if (!nameRef.current) return;
        await dispatch(updateCategory({data: {name: nameRef.current.value}, id: category._id})).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                return toggle();
            }
            const payload = res.payload as HttpError;
            return setError(payload.code ? t.httpErrors[payload.code as never] : t.common.errorSub);
        });
    }, [category, dispatch, t, toggle]);

    return (
        <Modal hide={toggle} isShowing={isShowing} title={t.admin.categories.updateTitle}>
            <div className={"p-5"}>
                <ErrorMessage error={error} />
                <InputField name={"category"} ref={nameRef} value={category.name}
                            label={t.admin.categories.fields.name} />
                <div className={"flex mt-5 justify-end"}>
                    <Button element={"button"} onClick={handleEdit}
                            text={pending ? t.common.loading : t.common.update} />
                </div>
            </div>
        </Modal>
    );
};

export default UpdateCategoryModal;