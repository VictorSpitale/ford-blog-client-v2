import React, {useCallback, useEffect, useState} from 'react';
import BaseView from "../../shared/BaseView";
import {useTranslation} from "../../../shared/hooks";
import SimplifiedPostCard from "../../posts/SimplifiedPostCard";
import {isEmpty} from "../../../shared/utils/object.utils";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {getLikedPosts} from "../../../context/actions/posts/posts.actions";
import {IUser} from "../../../shared/types/user.type";
import {IBasicPost} from "../../../shared/types/post.type";

type PropsType = {
    user: IUser
}

const LikesView = ({user}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const {users, pending} = useAppSelector(state => state.likedPosts);
    const [posts, setPosts] = useState<IBasicPost[]>([]);

    const fetchPosts = useCallback(async () => {
        await dispatch(getLikedPosts(user._id));
    }, [dispatch, user]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        const userAndPosts = users.find((u) => u.userId === user._id);
        if (userAndPosts) setPosts(userAndPosts.posts);
    }, [user._id, users]);

    return (
        <BaseView>
            <h1 data-content={"view-title"} className={"text-2xl font-semibold mb-4"}>{t.account.viewsName.LIKES}</h1>
            <p>{pending && t.common.loading}</p>
            {posts.map((post, index) => {
                return <SimplifiedPostCard key={index} post={post} />
            })}
            <p>{(!pending && isEmpty(posts)) && t.account.likes.noPosts}</p>
        </BaseView>
    );
};

export default LikesView;