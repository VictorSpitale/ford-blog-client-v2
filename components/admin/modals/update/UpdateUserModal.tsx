import React, {useCallback, useState} from 'react';
import {AnyFunction} from "../../../../shared/types/props.type";
import {IUser, UpdateUser} from "../../../../shared/types/user.type";
import Modal from "../../../modal/Modal";
import Image from "next/image";
import {getUserPictureSrc} from "../../../../shared/images/ProfilePicture";
import {useTranslation} from "../../../../shared/hooks";
import InputField from "../../../shared/InputField";
import RenderIf from "../../../shared/RenderIf";
import Button from "../../../shared/Button";
import Select from "react-select";
import {useAppDispatch, useAppSelector} from "../../../../context/hooks";
import {removePicture, updateUser} from "../../../../context/actions/users/user.actions";
import ErrorMessage from "../../../shared/ErrorMessage";
import {HttpError} from "../../../../shared/types/httpError.type";

type PropsType = {
    isShowing: boolean;
    toggle: AnyFunction;
    user: IUser;
}

const UpdateUserModal = ({user, isShowing, toggle}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const [error, setError] = useState("");
    const [picture, setPicture] = useState(user.picture);
    const [updatedUser, setUpdatedUser] = useState<UpdateUser>({pseudo: user.pseudo, role: user.role});

    const {pending} = useAppSelector(state => state.users);
    const {user: loggedUser} = useAppSelector(state => state.user);

    const roleOptions: { value: "0" | "1" | "2", label: string }[] = [
        {value: '0', label: t.common.roles.user},
        {value: '1', label: t.common.roles.poster},
        {value: '2', label: t.common.roles.admin},
    ]

    const handleDeletePicture = useCallback(async () => {
        setError('');
        await dispatch(removePicture(user)).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return setError(t.account.profile.errors.removeError);
            }
            setPicture(undefined);
        })
    }, [dispatch, t, user]);

    const handleSaveUser = useCallback(async () => {
        setError('');
        if (user._id === loggedUser._id) return setError(t.admin.users.cantUpdate);
        if (updatedUser.pseudo === user.pseudo) return;
        if (updatedUser.pseudo?.trim() === "" || (updatedUser.pseudo && (updatedUser.pseudo?.length < 6 || updatedUser.pseudo?.length > 18))) {
            return setError(t.account.profile.errors.pseudo);
        }
        await dispatch(updateUser({...updatedUser, _id: user._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                const payload = res.payload as HttpError;
                return setError(t.httpErrors[payload.code as never] || t.common.errorSub);
            }
            toggle();
        })
    }, [dispatch, t, toggle, updatedUser, user._id, user.pseudo, loggedUser]);

    return (
        <Modal isShowing={isShowing} hide={toggle} large={true} title={t.admin.users.updateTitle}>
            <div className={"flex gap-x-4 p-5 min-h-[300px]"}>
                <div className={"w-1/3 bg-red-500f flex items-center flex-col"}>
                    <div className={"relative rounded-lg overflow-hidden h-[200px] w-[200px]"}>
                        <Image alt={`${user.pseudo} profile picture`} src={getUserPictureSrc({...user, picture}).src}
                               layout={"fill"} objectFit={"cover"} />
                    </div>
                    <RenderIf condition={!!picture}>
                        <Button element={"button"} text={pending ? t.common.loading : t.admin.users.deletePicture}
                                classes={"mt-4"} style={"danger"}
                                onClick={handleDeletePicture} />
                    </RenderIf>
                </div>
                <div className={"w-full flex flex-col gap-y-2"}>
                    <ErrorMessage error={error} />
                    <InputField name={"pseudo"} label={t.account.profile.pseudo} value={user.pseudo}
                                onChange={(e) => setUpdatedUser({...updatedUser, pseudo: e.target.value})} />
                    <div className={"flex flex-col gap-y-1"}>
                        <form data-content={"role-selector"}>
                            <label className={"w-full text-gray-500"}
                                   htmlFor="role-selector">{t.account.profile.role}</label>
                            <Select inputId={"role-selector"} name={"role-selector"} options={roleOptions}
                                    defaultValue={roleOptions.find((r) => r.value === user.role)}
                                    onChange={function (opt) {
                                        /* istanbul ignore if */
                                        if (!opt) return;
                                        setUpdatedUser({...updatedUser, role: opt.value})
                                    }} />
                        </form>
                    </div>
                    <InputField name={"email"} label={t.account.profile.email} value={user.email} disabled={true} />
                    <div className={"mt-4 flex gap-x-4 justify-end"}>
                        <Button element={"button"} text={pending ? t.common.loading : t.common.confirm}
                                onClick={handleSaveUser} />
                        <Button element={"button"} text={t.common.cancel} style={"gray"}
                                onClick={toggle} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateUserModal;