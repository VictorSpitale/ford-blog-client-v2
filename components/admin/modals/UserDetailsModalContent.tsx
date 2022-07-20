import React, {useCallback, useEffect, useState} from 'react';
import {IUser} from "../../../shared/types/user.type";
import {AnyFunction} from "../../../shared/types/props.type";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {getUserById} from "../../../context/actions/admin/admin.actions";
import RenderIf from "../../shared/RenderIf";
import {useTranslation} from "../../../shared/hooks";
import {isEmpty} from "../../../shared/utils/object.utils";
import Image from "next/image";
import {getUserPictureSrc} from "../../../shared/images/ProfilePicture";

type PropsType = { setOtherModal: AnyFunction; } & (
    { needFetch: true; userId: string; }
    | { needFetch: false; user: IUser; }
    );
const UserDetailsModalContent = (props: PropsType) => {

    const [user, setUser] = useState({} as IUser);

    const {users, pending} = useAppSelector(state => state.users);

    const dispatch = useAppDispatch();
    const t = useTranslation();

    const fetchUser = useCallback(async () => {
        if (props.needFetch) {
            await dispatch(getUserById(props.userId));
        }
    }, [dispatch, props.needFetch]);

    useEffect(() => {
        let found;
        if (props.needFetch) {
            found = users.find((u) => u._id === props.userId);
        }
        if (found) setUser(found);
    }, [props.needFetch, users]);

    useEffect(() => {
        if (props.needFetch) {
            fetchUser();
        } else {
            setUser(props.user);
        }
    }, []);

    return (
        <div className={"px-4 py-2"}>
            <RenderIf condition={pending}>
                <p className={"italic"}>{t.common.loading}</p>
            </RenderIf>
            <RenderIf condition={isEmpty(user)}>
                <p>Aucun utilisateur trouvé</p>
            </RenderIf>
            <RenderIf condition={!isEmpty(user)}>
                <div className={"flex gap-x-4"}>
                    <div className={"w-1/4 bg-red-500f flex items-center flex-col"}>
                        <div className={"relative rounded-lg overflow-hidden h-[200px] w-[200px]"}>
                            <Image alt={`${user.pseudo} profile picture`} src={getUserPictureSrc(user).src}
                                   layout={"fill"} objectFit={"cover"} />
                        </div>
                        <p className={"font-bold text-2xl mt-3"}>{user.pseudo}</p>
                    </div>
                    <div className={"w-3/4 bg-amber-400"}>
                        e
                    </div>
                </div>
            </RenderIf>
        </div>
    );
};

export default UserDetailsModalContent;