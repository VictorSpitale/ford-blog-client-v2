import React, {ChangeEvent, useState} from 'react';
import BaseView from "../../shared/BaseView";
import {IUser, UpdateUser} from "../../../shared/types/user.type";
import InputField from "../../shared/InputField";
import {useTranslation} from "../../../shared/hooks";
import {getUserPictureSrc} from "../../../shared/images/ProfilePicture";
import Button from "../../shared/Button";
import ProfilePicture from "../../shared/ProfilePicture";
import {setError} from "../../../context/actions/errors.actions";
import {removePicture, updateUser, uploadPicture} from "../../../context/actions/users/user.actions";
import {HttpError} from "../../../shared/types/httpError.type";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import RenderIf from "../../shared/RenderIf";

type PropsType = {
    user: IUser,
    pending: boolean;
}

const ProfileView = ({user, pending}: PropsType) => {

    const profilePicture = getUserPictureSrc(user);
    const {profileViewError} = useAppSelector(state => state.errors);

    const [updatedUser, setUpdatedUser] = useState<UpdateUser>({pseudo: user.pseudo});
    const [success, setSuccess] = useState('');

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const handleSaveProfile = async () => {
        /* istanbul ignore if */
        if (pending) return;
        setSuccess('');
        dispatch(setError({error: "", key: "profileViewError"}));
        if (updatedUser.pseudo === user.pseudo) return;
        if (updatedUser.pseudo?.trim() === "" || (updatedUser.pseudo && (updatedUser.pseudo?.length < 6 || updatedUser.pseudo?.length > 18))) {
            return dispatch(setError({error: t.account.profile.errors.pseudo, key: "profileViewError"}));
        }
        await dispatch(updateUser({...updatedUser, _id: user._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                const payload = res.payload as HttpError;
                return dispatch(setError({
                    error: t.httpErrors[payload.code as never] || t.common.errorSub,
                    key: "profileViewError"
                }));
            }
            return setSuccess(t.account.profile.success.profile);
        })
    }

    const handleProfilePictureUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        /* istanbul ignore if */
        if (pending) return;
        setSuccess('');
        dispatch(setError({error: "", key: "profileViewError"}));
        const files = e.target.files;
        if (!files || !files[0]) return;
        const file = files[0];
        if (file.size > 100000) {
            return dispatch(setError({error: t.account.profile.errors.fileSize, key: "profileViewError"}));
        }
        const data = new FormData();
        data.append("file", file);
        await dispatch(uploadPicture({data, _id: user._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return dispatch(setError({error: t.account.profile.errors.fileError, key: "profileViewError"}));
            }
            return setSuccess(t.account.profile.success.upload);
        })
    }

    const handleProfilePictureDeletion = async () => {
        /* istanbul ignore if */
        if (pending) return;
        setSuccess('');
        dispatch(setError({error: "", key: "profileViewError"}));
        await dispatch(removePicture(user)).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return dispatch(setError({error: t.account.profile.errors.removeError, key: "profileViewError"}));
            }
            return setSuccess(t.account.profile.success.deletion);
        })
    }

    return (
        <BaseView>
            <h1 data-content={"view-title"} className={"text-2xl font-semibold mb-4"}>{t.account.profile.title}</h1>
            <RenderIf condition={!!success}>
                <p className={"mb-4 rounded w-full bg-green-400 text-white px-3 text-justify"}>{success}</p>
            </RenderIf>
            <RenderIf condition={!!profileViewError}>
                <p className={"mb-4 rounded w-full bg-red-400 text-white px-3 text-justify"}>{profileViewError}</p>
            </RenderIf>
            <p className={"font-bold"}>{t.account.profile.avatar}</p>
            <div className={"flex w-full items-center"}>
                <ProfilePicture src={profilePicture.src} />
                <div className={"flex md:flex-row flex-col w-fit ml-4 md:ml-0"}>
                    <div className={"h-fit"}>
                        <label
                            className={"block cursor-pointer leading-[200%] text-center border-0 md:mx-4 rounded border" +
                                " px-4 text-white bg-primary-400 shadow-2xl h-[34px] hover:bg-primary-500"}>
                            {t.account.profile.upload}
                            <input type={"file"} id={"inputFile"} style={{display: "none"}}
                                   accept={'.jpeg, .png, .jpg'} onChange={handleProfilePictureUpload} />
                        </label>
                    </div>
                    {!profilePicture.default &&
						<button onClick={handleProfilePictureDeletion} className=
                            {"rounded border h-fit px-4 text-white bg-red-400 shadow-2xl h-[34px]"}>{t.account.profile.delete}
						</button>}
                </div>
            </div>
            <hr className={"my-3"} />
            <div className={"flex flex-col md:flex-row"}>
                <InputField name={"pseudo"} value={user.pseudo} label={t.account.profile.pseudo}
                            onChange={(e) => setUpdatedUser({pseudo: e.target.value})} />
                <span className={"my-2 md:my-0 md:mx-4"} />
                <InputField name={"email"} value={user.email} label={t.account.profile.email}
                            disabled={true} />
            </div>
            <hr className={"my-3"} />
            <Button text={pending ? t.common.loading : t.common.save} element={"button"}
                    classes={"float-right px-3 py-1 !rounded"}
                    onClick={handleSaveProfile} />
        </BaseView>
    );
};

export default ProfileView;