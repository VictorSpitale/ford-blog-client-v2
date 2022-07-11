import React, {memo, useEffect, useState} from 'react';
import Heart from "./Heart";
import {IPost, LikeStatus} from "../../../shared/types/post.type";
import {useAppDispatch} from "../../../context/hooks";
import {changeLikeStatus} from "../../../context/actions/posts.actions";
import {useTranslation} from "../../../shared/hooks";
import {isEmpty} from "../../../shared/utils/object.utils";
import {IUser} from "../../../shared/types/user.type";

type PropsType = {
    post: IPost;
    user: IUser;
}

const LikePostButton = ({post, user}: PropsType) => {

    const [isLiked, setIsLiked] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const t = useTranslation();

    const like = async () => {
        setIsLiked(true)
        await dispatch(changeLikeStatus({status: LikeStatus.LIKE, slug: post.slug}))
    }

    const unLike = async () => {
        setIsLiked(false)
        await dispatch(changeLikeStatus({status: LikeStatus.UNLIKE, slug: post.slug}))
    }

    const likeMessage = () => {
        const likes = post.likes;
        return t.posts.like.count.replace('{{count}}', likes.toString()).replace('{{s}}', likes > 1 ? "s" : "");
    }

    useEffect(() => {
        setIsLiked(post.authUserLiked);
    }, [post]);

    return (
        <div className={"flex items-center w-fit pt-3 relative"}>
            {isEmpty(user) ?
                <>
                    <Heart isLiked={false} onClick={() => null} />
                    <p className={"hidden md:block ml-20 pl-2 italic text-secondary-600"}>{t.posts.like.needLoggedIn}</p>
                </>
                :
                <>
                    <Heart isLiked={isLiked} onClick={isLiked ? unLike : like} />
                    <p data-content={"likes-count"}
                       className={"hidden md:block ml-20 pl-2 italic text-secondary-600"}>{likeMessage()}</p>
                </>
            }
        </div>
    );
};

export default memo(LikePostButton);