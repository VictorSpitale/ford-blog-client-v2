import React from 'react';
import BaseView from "../../shared/BaseView";
import {useTranslation} from "../../../shared/hooks";
import SimplifiedPostCard from "../../posts/SimplifiedPostCard";
import {isEmpty} from "../../../shared/utils/object.utils";
import {IBasicPost} from "../../../shared/types/post.type";

type PropsType = {
    likes: {
        likedPosts: IBasicPost[];
        pending: boolean;
    }
}

const LikesView = ({likes}: PropsType) => {

    const t = useTranslation();

    return (
        <BaseView>
            <h1 className={"text-2xl font-semibold mb-4"}>{t.account.viewsName.LIKES}</h1>
            <p>{likes.pending && t.common.loading}</p>
            {likes.likedPosts.map((post, index) => {
                return <SimplifiedPostCard key={index} post={post} />
            })}
            <p>{(!likes.pending && isEmpty(likes.likedPosts)) && t.account.likes.noPosts}</p>
        </BaseView>
    );
};

export default LikesView;