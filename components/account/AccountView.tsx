import React, {memo} from 'react';
import AccountViewSwitcher from "./AccountViewSwitcher";
import {AccountViews} from "../../shared/types/accountViews.type";
import {useTranslation} from "../../shared/hooks";
import LikesView from "./views/LikesView";
import {IUser} from "../../shared/types/user.type";
import ProfileView from "./views/ProfileView";
import SecurityView from "./views/SecurityView";

type PropsType = {
    view: AccountViews,
    authUser: {
        user: IUser,
        pending: boolean
    },
}

const AccountView = ({view, authUser}: PropsType) => {

    const t = useTranslation();

    return (
        <div className={"mt-16 w-3/4 mx-auto max-w-[800px]"}>
            <h1 className={"text-4xl font-bold mb-6"}>{t.account.title}</h1>
            <div className={"flex flex-col md:flex-row"}>
                <AccountViewSwitcher activeView={view} />
                {
                    view === AccountViews.LIKES ?
                        <LikesView user={authUser.user} /> :
                        view === AccountViews.PROFILE ?
                            <ProfileView user={authUser.user} pending={authUser.pending} /> :
                            view === AccountViews.SECURITY ?
                                <SecurityView user={authUser.user} pending={authUser.pending} /> :
                                <></>
                }
            </div>
        </div>
    );
};

export default memo(AccountView);