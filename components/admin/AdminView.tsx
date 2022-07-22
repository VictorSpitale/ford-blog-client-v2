import React from 'react';
import {useTranslation} from "../../shared/hooks";
import {AdminViews} from "../../shared/types/adminViews.type";
import AdminViewSwitcher from "./AdminViewSwitcher";
import RenderIf from "../shared/RenderIf";
import PostsView from "./views/PostsView";
import CategoriesView from "./views/CategoriesView";
import UsersView from "./views/UsersView";

type PropsType = {
    view: AdminViews
}

const AdminView = ({view}: PropsType) => {

    const t = useTranslation();

    return (
        <div data-content={"admin-view"} className={"mt-16 w-11/12 mx-auto"}>
            <h1 className={"text-4xl font-bold mb-6"}>{t.admin.title}</h1>
            <div className={"flex flex-col md:flex-row"}>
                <AdminViewSwitcher activeView={view} />
                <RenderIf condition={view === AdminViews.POSTS}>
                    <PostsView />
                </RenderIf>
                <RenderIf condition={view === AdminViews.CATEGORIES}>
                    <CategoriesView />
                </RenderIf>
                <RenderIf condition={view === AdminViews.USERS}>
                    <UsersView />
                </RenderIf>
            </div>
        </div>
    );
};

export default AdminView;