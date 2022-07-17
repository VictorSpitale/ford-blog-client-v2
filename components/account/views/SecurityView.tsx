import React, {FormEvent, useRef, useState} from 'react';
import BaseView from "../../shared/BaseView";
import InputField from "../../shared/InputField";
import {useModal, useTranslation} from "../../../shared/hooks";
import Button from "../../shared/Button";
import {IUser} from "../../../shared/types/user.type";
import DeleteAccountModal from "../modals/DeleteAccountModal";
import {setError} from "../../../context/actions/errors.actions";
import {deleteAccount, updateLoggedUser} from "../../../context/actions/user.actions";
import {HttpError} from "../../../shared/types/httpError.type";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import RenderIf from "../../shared/RenderIf";

type PropsType = {
    user: IUser;
    pending: boolean;
}

const SecurityView = ({user, pending}: PropsType) => {

    const [success, setSuccess] = useState('');

    const {securityViewError} = useAppSelector(state => state.errors);
    const {toggle, isShowing} = useModal();

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const passwordRef = useRef<HTMLInputElement>(null);
    const currentPasswordRef = useRef<HTMLInputElement>(null);

    const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(setError({error: "", key: "securityViewError"}))
        setSuccess('');
        /* istanbul ignore if */
        if (!passwordRef.current || !currentPasswordRef.current) return;
        const password = passwordRef.current.value;
        const currentPassword = currentPasswordRef.current.value;
        if (password.trim() === "" || password.length < 6) {
            return dispatch(setError({error: t.account.security.errors.password, key: "securityViewError"}))
        }
        if (currentPassword.trim() === "" || currentPassword.length < 6) {
            return dispatch(setError({error: t.account.security.errors.currentPassword, key: "securityViewError"}))
        }
        await dispatch(updateLoggedUser({password, _id: user._id, currentPassword})).then((res) => {
            /* istanbul ignore if */
            if (!passwordRef.current || !currentPasswordRef.current) return;
            if (res.meta.requestStatus === "rejected") {
                const payload = res.payload as HttpError;
                if (payload.code && payload.code === 17) {
                    return dispatch(setError({error: t.httpErrors["17"], key: "securityViewError"}))
                }
                return dispatch(setError({error: t.account.security.errors.rejectedPassword, key: "securityViewError"}))
            }
            passwordRef.current.value = '';
            currentPasswordRef.current.value = '';
            return setSuccess(t.account.security.success)
        })
    }

    const handleDeleteAccount = async () => {
        dispatch(setError({error: "", key: "securityViewError"}))
        setSuccess('');
        await dispatch(deleteAccount(user._id)).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                toggle();
                return dispatch(setError({error: t.account.security.errors.deleteAccount, key: "securityViewError"}))
            }
        })
    }

    return (

        <>
            <DeleteAccountModal handleDelete={handleDeleteAccount} toggle={toggle} isShowing={isShowing}
                                pending={pending} />
            <BaseView>
                <h1 data-content={"view-title"}
                    className={"text-2xl font-semibold mb-4"}>{t.account.security.title}</h1>
                <RenderIf condition={!!securityViewError}>
                    <p className={"mb-4 rounded w-full bg-red-400 text-white px-3 text-justify"}>{securityViewError}</p>
                </RenderIf>
                <RenderIf condition={!!success}>
                    <p className={"mb-4 rounded w-full bg-green-400 text-white px-3 text-justify"}>{success}</p>
                </RenderIf>
                <form onSubmit={handleChangePassword}>
                    <div className={"hidden"}>
                        <input autoComplete={"email"} value={user.email} readOnly={true} />
                        <input autoComplete={"username"} value={user.pseudo} readOnly={true} />
                    </div>
                    <InputField name={"current-password"} label={t.account.security.currentPassword} type={"password"}
                                autoComplete={"current-password"} ref={currentPasswordRef} />
                    <span className={"my-4 block"} />
                    <InputField name={"password"} label={t.account.security.password} type={"password"}
                                autoComplete={"new-password"} ref={passwordRef} />
                    <div className={"flex justify-end"}>
                        <Button classes={"mt-5 !rounded px-3 py-1"}
                                text={pending ? t.common.loading : t.common.save}
                                element={"button"} type={"submit"} />
                    </div>
                </form>
                <hr className={"my-3"} />
                <h1 className={"text-2xl text-red-500"}>{t.account.security.delete.title}</h1>
                <p>{t.account.security.delete.warning}</p>
                <button onClick={toggle}
                        className={"mt-3 rounded text-red-500 border px-2 shadow hover:bg-red-500 hover:text-white"}>{t.account.security.delete.action}
                </button>
            </BaseView>
        </>
    );
};

export default SecurityView;