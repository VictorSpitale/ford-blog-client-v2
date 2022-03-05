import React, {useState} from 'react';
import Heart from "./Heart";
import {IPost} from "../../../shared/types/post.type";

const LikePostButton = ({post}: { post: IPost }) => {

    const uid = false
    const [isLiked, setIsLiked] = useState<boolean>(false)

    const like = () => {
        setIsLiked(true)
    }

    const unLike = () => {
        setIsLiked(false)
    }

    const likeMessage = () => {
        const likes = post.likes;
        if (likes > 1) {
            return likes + ' mentions j\'aime';
        }
        return likes + ' mention j\'aime';
    }

    //@TODO: useEffet => set default like state
    //@TODO: get login state => uid
    //@TODO: Translations

    return (
        <div className={"flex items-center w-fit pt-3"}>
            {!uid &&
				<>
					<Heart isLiked={false} onClick={() => null} />
					<p className={"pl-2 italic text-secondary-600"}>Connectez-vous pour aimer cet article</p>
				</>
            }
            {uid &&
				<>
					<Heart isLiked={isLiked} onClick={isLiked ? unLike : like} />
					<p className={"pl-2 italic text-secondary-600"}>{likeMessage()}</p>
				</>
            }
        </div>
    );
};

export default LikePostButton;