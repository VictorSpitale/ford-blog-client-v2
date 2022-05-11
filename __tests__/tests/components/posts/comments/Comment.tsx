import React, {memo} from 'react';
import {IComment} from "../../../../../shared/types/comment.type";
import defaultSrc from '../../../../../public/static/img/default-profile.png'
import ProfilePicture from "../../../../../components/shared/ProfilePicture";

type PropsType = {
    comment: IComment
}

const Comment = ({comment}: PropsType) => {
    return (
        <div className={"my-2"}>
            <div className={"flex gap-x-3"}>
                <ProfilePicture src={comment.commenter.picture || defaultSrc.src}/>
                <div className={"flex flex-col"}>
                    <h3 className={"font-bold text-lg"}>{comment.commenter.pseudo}</h3>
                    <p>Il y a 3 mois</p>
                </div>
            </div>
            <p className={"mt-2"}>{comment.comment}</p>
        </div>
    );
};

export default memo(Comment);