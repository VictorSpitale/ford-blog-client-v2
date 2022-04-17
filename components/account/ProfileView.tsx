import React, {ChangeEvent, useState} from 'react';
import BaseView from "./BaseView";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import Image from "next/image"
import {getUserPictureSrc, UpdateUser} from "../../shared/types/user.type";
import InputField from "../shared/InputField";
import {useTranslation} from "../../shared/hooks";
import {removePicture, updateLoggedUser, uploadPicture} from "../../context/actions/user.actions";
import {HttpError} from "../../shared/types/httpError.type";

const ProfileView = () => {
    const {user, pending} = useAppSelector(state => state.user);
    const profilePicture = getUserPictureSrc(user);
    const t = useTranslation();
    const [updatedUser, setUpdatedUser] = useState<UpdateUser>({pseudo: user.pseudo});
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const handleSave = async () => {
        setError('');
        if (updatedUser.pseudo === user.pseudo) return;
        if (updatedUser.pseudo?.trim() === "" || (updatedUser.pseudo && (updatedUser.pseudo?.length < 6 || updatedUser.pseudo?.length > 18))) {
            return setError(t.account.profile.errors.pseudo);
        }
        await dispatch(updateLoggedUser({...updatedUser, _id: user._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                const payload = res.payload as HttpError;
                return setError(t.httpErrors[payload.code as never] || t.common.errorSub);
            }
        })
    }

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        setError('');
        const files = e.target.files;
        if (!files || !files[0]) return;
        const file = files[0];
        if (file.size > 100000) {
            return setError(t.account.profile.errors.fileSize);
        }
        const data = new FormData();
        data.append("file", file);
        await dispatch(uploadPicture({data, _id: user._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return setError(t.account.profile.errors.fileError)
            }
        })
    }

    const handleRemovePicture = async () => {
        setError('');
        await dispatch(removePicture(user._id)).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return setError(t.account.profile.errors.removeError)
            }
        })
    }

    return (
        <BaseView>
            <h1 className={"text-2xl font-semibold mb-4"}>{t.account.profile.title}</h1>
            <p className={"mb-4 rounded w-full bg-red-400 text-white px-3 text-justify"}>{error}</p>
            <p className={"font-bold"}>{t.account.profile.avatar}</p>
            <div className={"flex w-full items-center"}>
                <div className={"rounded-full overflow-hidden w-[50px] h-[50px]"}>
                    <Image alt={"profile picture"} src={profilePicture.src} width={"50"} height={"50"} />
                </div>
                <div className={"flex md:flex-row flex-col w-fit ml-4 md:ml-0"}>
                    <div className={"h-fit"}>
                        <label
                            className={"block cursor-pointer leading-[200%] text-center border-0 md:mx-4 rounded border px-4 text-white bg-primary-400 shadow-2xl h-[34px]"}>
                            {t.account.profile.upload}
                            <input type={"file"} id={"inputFile"} style={{display: "none"}}
                                   accept={'.jpeg, .png, .jpg'} onChange={handleFileUpload} />
                        </label>
                    </div>
                    {!profilePicture.default &&
						<button onClick={handleRemovePicture} className=
                            {"rounded border h-fit px-4 text-white bg-red-400 shadow-2xl h-[34px]"}>{t.account.profile.delete}
						</button>}
                </div>
            </div>
            <hr className={"my-3"} />
            <div className={"flex flex-col md:flex-row"}>
                <InputField name={"pseudo"} value={user.pseudo} label={t.account.profile.pseudo}
                            onChange={(e) => setUpdatedUser({pseudo: e.target.value})} />
                <span className={"my-2 md:my-0 md:mx-4"} />
                <InputField name={"email"} value={user.email} label={t.account.profile.email} disabled={true} />
            </div>
            <hr className={"my-3"} />
            <button onClick={handleSave}
                    className={"float-right rounded text-white bg-primary-400 px-3 py-1"}>{pending ? t.common.loading : t.account.profile.save}
            </button>
        </BaseView>
    );
};

export default ProfileView;