import React, {ChangeEvent, useState} from 'react';
import BaseView from "../../shared/BaseView";
import {IUser, UpdateUser} from "../../../shared/types/user.type";
import InputField from "../../shared/InputField";
import {useTranslation} from "../../../shared/hooks";
import {getUserPictureSrc} from "../../../shared/images/ProfilePicture";
import Button from "../../shared/Button";
import ProfilePicture from "../../shared/ProfilePicture";
import {AnyFunction} from "../../../shared/types/props.type";

type PropsType = {
    authUser: {
        user: IUser,
        pending: boolean;
    };
    profile: {
        saveChanges: AnyFunction;
        uploadFile: AnyFunction;
        removeProfilePicture: AnyFunction;
        error: string;
    }
}

const ProfileView = ({authUser, profile}: PropsType) => {

    const profilePicture = getUserPictureSrc(authUser.user);

    const t = useTranslation();

    const [updatedUser, setUpdatedUser] = useState<UpdateUser>({pseudo: authUser.user.pseudo});

    const handleSave = async () => {
        await profile.saveChanges(updatedUser, authUser.user);
    }

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        await profile.uploadFile(e.target.files);
    }

    const handleRemovePicture = async () => {
        await profile.removeProfilePicture();
    }

    return (
        <BaseView>
            <h1 className={"text-2xl font-semibold mb-4"}>{t.account.profile.title}</h1>
            <p className={"mb-4 rounded w-full bg-red-400 text-white px-3 text-justify"}>{profile.error}</p>
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
                <InputField name={"pseudo"} value={authUser.user.pseudo} label={t.account.profile.pseudo}
                            onChange={(e) => setUpdatedUser({pseudo: e.target.value})} />
                <span className={"my-2 md:my-0 md:mx-4"} />
                <InputField name={"email"} value={authUser.user.email} label={t.account.profile.email}
                            disabled={true} />
            </div>
            <hr className={"my-3"} />
            <Button text={authUser.pending ? t.common.loading : t.common.save} element={"button"}
                    classes={"float-right px-3 py-1 !rounded"}
                    onClick={handleSave} />
        </BaseView>
    );
};

export default ProfileView;