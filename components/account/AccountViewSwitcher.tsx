import React from 'react';
import {AccountViews} from "../../shared/types/accountViews.type";
import {useTranslation} from "../../shared/hooks";
import {useAppDispatch} from "../../context/hooks";
import {className} from "../../shared/utils/class.utils";
import {setView} from "../../context/actions/account.actions";
import {getAccountViewButtons} from "../../shared/utils/account/views.utils";
import {AnyFunction} from "../../shared/types/props.type";

type PropsType = {
    activeView: AccountViews;
    handleLogout: AnyFunction
}

const AccountViewSwitcher = ({activeView, handleLogout}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const changeView = async (view: AccountViews) => {
        if (view === activeView) return;
        await dispatch(setView(view));
    }

    return (
        <div data-content={"buttons"} className={"flex flex-row md:flex-col flex-wrap md:mr-6"}>
            {getAccountViewButtons(activeView, t).map((viewButton, index) => {
                return <button data-content={`button-${viewButton.view}`} key={index}
                               onClick={() => changeView(viewButton.view)}
                               className={className("w-36 rounded-2xl my-1 px-4 text-left",
                                   viewButton.isActive ? "bg-primary-100 text-dark-500"
                                       : "text-gray-400 bg-transparent hover:bg-blue-100")}>{viewButton.label}
                </button>
            })}
            <button data-content={"button-logout"} className={"px-4 my-1 text-left"}
                    onClick={handleLogout}>{t.account.logout}</button>
        </div>
    );
};
export default AccountViewSwitcher;