import React, {useEffect, useState} from 'react';
import Heart from "./Heart";
import {IPost, LikeStatus} from "../../../shared/types/post.type";
import {useAppContext} from "../../../context/AppContext";
import {useAppDispatch} from "../../../context/hooks";
import {changeLikeStatus} from "../../../context/actions/posts.actions";
import {useTranslation} from "next-i18next";

const LikePostButton = ({post}: { post: IPost }) => {

    const uid = useAppContext();
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const {t} = useTranslation('posts')

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
        return t('like.count', {count: likes, s: likes > 1 ? "s" : ""})
    }

    useEffect(() => {
        setIsLiked(post.authUserLiked);
    }, [post]);

    return (
        <div className={"flex items-center w-fit pt-3 relative"}>
            {!uid &&
				<>
					<Heart isLiked={false} onClick={() => null} />
					<p className={"hidden md:block ml-20 pl-2 italic text-secondary-600"}>{t('like.needLoggedIn')}</p>
				</>
            }
            {uid &&
				<>
					<Heart isLiked={isLiked} onClick={isLiked ? unLike : like} />
					<p className={"hidden md:block ml-20 pl-2 italic text-secondary-600"}>{likeMessage()}</p>
				</>
            }
        </div>
    );
};

export default LikePostButton;