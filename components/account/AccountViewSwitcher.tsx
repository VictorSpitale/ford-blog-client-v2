import React from 'react';
import {AccountViews, getViewType, ViewButtonType} from "../../shared/types/accountViews.type";
import {useTranslation} from "../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {className} from "../../shared/utils/class.utils";
import {setView} from "../../context/actions/account.actions";
import {logout} from "../../context/actions/user.actions";

const AccountViewSwitcher = () => {

    const t = useTranslation();
    const {view: activeView} = useAppSelector(state => state.accountView)
    const dispatch = useAppDispatch();
    const getViews = (): ViewButtonType[] => {
        return Object.keys(AccountViews).map((view) => {
            const viewType = getViewType(view.toLowerCase());
            return {
                view: viewType,
                isActive: activeView === viewType,
                label: t.account.viewsName[view as never]
            }
        })
    }

    const changeView = async (view: AccountViews) => {
        if (view === activeView) return;
        await dispatch(setView(view));
    }

    const handleLogout = async () => {
        await dispatch(logout())
    }

    return (
        <div className={"flex flex-row md:flex-col flex-wrap md:mr-6"}>
            {getViews().map((view, index) => {
                return <button key={index} onClick={() => changeView(view.view)}
                               className={className("w-36 rounded-2xl my-1 px-4 text-left",
                                   view.isActive ? "bg-primary-100 text-dark-500"
                                       : "text-gray-400 bg-transparent hover:bg-blue-100")}>{view.label}
                </button>
            })}
            <button className={"px-4 my-1 text-left"} onClick={handleLogout}>{t.account.logout}</button>
        </div>
    );
};
export default AccountViewSwitcher;