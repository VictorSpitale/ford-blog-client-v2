import React, {memo} from 'react';
import AccountViewSwitcher from "./AccountViewSwitcher";
import {AccountViews} from "../../shared/types/accountViews.type";
import {useTranslation} from "../../shared/hooks";
import LikesView from "./LikesView";
import {IUser} from "../../shared/types/user.type";
import {IBasicPost} from "../../shared/types/post.type";
import ProfileView from "./ProfileView";
import SecurityView from "./SecurityView";

type PropsType = {
    view: AccountViews,
    authUser: {
        user: IUser,
        pending: boolean
    },
    likes: {
        likedPosts: IBasicPost[],
        pending: boolean;
    }
}

const AccountView = ({view, authUser, likes}: PropsType) => {

    const t = useTranslation();

    return (
        <div className={"mt-16 w-3/4 mx-auto max-w-[800px]"}>
            <h1 className={"text-4xl font-bold mb-6"}>{t.account.title}</h1>
            <div className={"flex flex-col md:flex-row"}>
                <AccountViewSwitcher activeView={view} />
                {
                    view === AccountViews.LIKES ?
                        <LikesView likes={likes} /> :
                        view === AccountViews.PROFILE ?
                            <ProfileView /> :
                            view === AccountViews.SECURITY ?
                                <SecurityView /> :
                                <></>
                }
            </div>
        </div>
    );
};

export default memo(AccountView);