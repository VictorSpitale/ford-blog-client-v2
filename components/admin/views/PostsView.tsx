import React from 'react';
import BaseView from "../../shared/BaseView";
import {useTranslation} from "../../../shared/hooks";

const PostsView = () => {

    const t = useTranslation();

    return (
        <BaseView>
            <h1 className={"text-2xl font-semibold mb-4"}>{t.admin.posts.title}</h1>
        </BaseView>
    );
};

export default PostsView;