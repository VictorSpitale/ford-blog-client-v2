import React from 'react';
import {className} from "../../shared/utils/class.utils";
import {useTranslation} from "../../shared/hooks";
import {getAdminViewButtons} from "../../shared/utils/admin/views.utils";
import {AdminViews} from "../../shared/types/adminViews.type";
import {useAppDispatch} from "../../context/hooks";
import {setAdminView} from "../../context/actions/admin/admin.actions";
import Link from "next/link";

type PropsType = {
    activeView: AdminViews
}

const AdminViewSwitcher = ({activeView}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const changeView = async (view: AdminViews) => {
        if (view === activeView) return;
        await dispatch(setAdminView(view));
    }

    return (
        <div data-content={"buttons"} className={"flex flex-row md:flex-col flex-wrap md:mr-6"}>
            {getAdminViewButtons(activeView, t).map((viewButton, index) => {
                return <Link key={index} passHref={true} href={`/admin?view=${viewButton.view}`}>
                    <button data-content={`button-${viewButton.view}`}
                            onClick={() => changeView(viewButton.view)}
                            className={className("w-36 rounded-2xl my-1 px-4 text-left",
                                viewButton.isActive ? "bg-primary-100 text-dark-500"
                                    : "text-gray-400 bg-transparent hover:bg-blue-100")}>{viewButton.label}
                    </button>
                </Link>
            })}
        </div>
    );
};

export default AdminViewSwitcher;