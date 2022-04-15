import React, {useEffect, useState} from 'react';
import Heart from "./Heart";
import {IPost, LikeStatus} from "../../../shared/types/post.type";
import {useAppContext} from "../../../context/AppContext";
import {useAppDispatch} from "../../../context/hooks";
import {changeLikeStatus} from "../../../context/actions/posts.actions";

const LikePostButton = ({post}: { post: IPost }) => {

    const uid = useAppContext();
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const dispatch = useAppDispatch();

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
        if (likes > 1) {
            return likes + ' mentions j\'aime';
        }
        return likes + ' mention j\'aime';
    }

    useEffect(() => {
        setIsLiked(post.authUserLiked);
    }, [post]);

    return (
        <div className={"flex items-center w-fit pt-3 relative"}>
            {!uid &&
				<>
					<Heart isLiked={false} onClick={() => null} />
					<p className={"ml-20 pl-2 italic text-secondary-600"}>Connectez-vous pour aimer cet article</p>
				</>
            }
            {uid &&
				<>
					<Heart isLiked={isLiked} onClick={isLiked ? unLike : like} />
					<p className={"ml-20 pl-2 italic text-secondary-600"}>{likeMessage()}</p>
				</>
            }
        </div>
    );
};

export default LikePostButton;