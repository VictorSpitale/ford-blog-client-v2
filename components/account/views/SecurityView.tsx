import React, {FormEvent, RefObject, useRef, useState} from 'react';
import BaseView from "../../shared/BaseView";
import InputField from "../../shared/InputField";
import {useModal, useTranslation} from "../../../shared/hooks";
import Button from "../../shared/Button";
import {IUser} from "../../../shared/types/user.type";
import {AnyFunction} from "../../../shared/types/props.type";
import DeleteAccountModal from "../modals/DeleteAccountModal";

type PropsType = {
    authUser: {
        user: IUser;
        pending: boolean;
    },
    security: {
        error: string;
        deleteAccount: (setSuccess: AnyFunction) => void;
        changePassword: (setSuccess: AnyFunction, password: string, setPassword: AnyFunction, ref: RefObject<HTMLInputElement>) => void;
    }
}

const SecurityView = ({authUser, security}: PropsType) => {

    const [success, setSuccess] = useState('');
    const [password, setPassword] = useState('');

    const t = useTranslation();
    const ref = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await security.changePassword(setSuccess, password, setPassword, ref);
    }

    const handleDelete = async () => {
        await security.deleteAccount(setSuccess);
    }

    const {toggle, isShowing} = useModal();

    return (

        <>
            <DeleteAccountModal handleDelete={handleDelete} toggle={toggle} isShowing={isShowing}
                                pending={authUser.pending} />
            <BaseView>
                <h1 className={"text-2xl font-semibold mb-4"}>{t.account.security.title}</h1>
                <p className={"mb-4 rounded w-full bg-red-400 text-white px-3 text-justify"}>{security.error}</p>
                <p className={"mb-4 rounded w-full bg-green-400 text-white px-3 text-justify"}>{success}</p>
                <form onSubmit={handleSubmit}>
                    <div className={"hidden"}>
                        <input autoComplete={"email"} value={authUser.user.email} readOnly={true} />
                    </div>
                    <InputField name={"password"} label={t.account.security.password} type={"password"}
                                autoComplete={"new-password"} ref={ref}
                                onChange={(e) => setPassword(e.target.value)} />
                    <div className={"flex justify-end"}>
                        <Button classes={"mt-5 !rounded px-3 py-1"}
                                text={authUser.pending ? t.common.loading : t.common.save}
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