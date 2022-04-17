import React, {useEffect} from 'react';
import BaseView from "./BaseView";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {useTranslation} from "../../shared/hooks";
import {getLikedPost} from "../../context/actions/posts.actions";
import SimplifiedPostCard from "../posts/SimplifiedPostCard";
import {isEmpty} from "../../shared/utils/object.utils";

const LikesView = () => {

    const {posts, pending} = useAppSelector(state => state.likedPosts);
    const {user} = useAppSelector(state => state.user);
    const t = useTranslation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchPosts = async () => {
            await dispatch(getLikedPost(user._id));
        }
        fetchPosts();
    }, []);

    return (
        <BaseView>
            <h1 className={"text-2xl font-semibold mb-4"}>{t.account.viewsName.LIKES}</h1>
            <p>{pending && t.common.loading}</p>
            {posts.map((post, index) => {
                return <SimplifiedPostCard key={index} post={post} />
            })}
            <p>{(!pending && isEmpty(posts)) && t.account.likes.noPosts}</p>
        </BaseView>
    );
};

export default LikesView;