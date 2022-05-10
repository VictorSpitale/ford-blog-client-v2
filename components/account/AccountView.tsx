import React, {memo} from 'react';
import AccountViewSwitcher from "./AccountViewSwitcher";
import {useAppSelector} from "../../context/hooks";
import {getAccountView} from "../../shared/types/accountViews.type";
import {useTranslation} from "../../shared/hooks";

const AccountView = () => {
    const {view} = useAppSelector(state => state.accountView)
    const t = useTranslation();
    return (
        <div className={"mt-16 w-3/4 mx-auto max-w-[800px]"}>
            <h1 className={"text-4xl font-bold mb-6"}>{t.account.title}</h1>
            <div className={"flex flex-col md:flex-row"}>
                <AccountViewSwitcher />
                {getAccountView(view)}
            </div>
        </div>
    );
};

export default memo(AccountView);