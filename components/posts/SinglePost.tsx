import React, {useCallback, useEffect, useState} from 'react';
import Image from "next/image";
import {getPostCardImg} from "../../shared/images/postCardImg";
import {capitalize} from "../../shared/utils/string.utils";
import CategoryInput from "../categories/CategoryInput";
import LikePostButton from "./like/LikePostButton";
import {className} from "../../shared/utils/class.utils";
import {IPost} from "../../shared/types/post.type";
import {blurImg} from "../../shared/images/blurImg";
import Trash from "../shared/icons/Trash";
import Edit from "../shared/icons/Edit";
import {useAppSelector} from "../../context/hooks";
import {IUserRole} from "../../shared/types/user.type";
import {useModal, useTranslation} from "../../shared/hooks";
import {getTimeSinceMsg, timeSince} from "../../shared/utils/date.utils";
import DeletePostModal from "./modals/DeletePostModal";
import UpdatePostModal from "./modals/UpdatePostModal";
import Comments from "./comments/Comments";

const SinglePost = ({post}: { post: IPost }) => {
    const t = useTranslation();
    /* istanbul ignore next */
    const {user} = useAppSelector(state => state.user)
    const {toggle, isShowing} = useModal();
    const {toggle: toggleUpdate, isShowing: isUpdateShowing} = useModal();

    const [postedDate, setPostedDate] = useState('');

    const timeSinceMsg = useCallback(() => {
        const timeSinceObj = timeSince(post.createdAt)
        return getTimeSinceMsg(t, timeSinceObj);
    }, [post.createdAt, t]);

    useEffect(() => {
        setPostedDate(timeSinceMsg());
    }, [timeSinceMsg]);

    return (
        <>
            <DeletePostModal post={post} toggle={toggle} isShowing={isShowing} />
            <UpdatePostModal post={post} toggle={toggleUpdate} isShowing={isUpdateShowing} />
            <div data-content={"single-post"}
                 className={"mx-8 md:mx-24 pb-2 mb-10 lg:mx-32 xl:mx-60 bg-transparent mt-5 rounded-2xl shadow-2xl"}>
                <div
                    className={"shadow-xl mx-auto w-full h-[315px]" +
                        " lg:h-[450px] relative rounded-t-2xl overflow-hidden"}>
                    <Image src={getPostCardImg(post)} layout={"fill"}
                           objectFit={"cover"} priority={true} alt={post.title} placeholder={"blur"}
                           blurDataURL={blurImg} />
                </div>
                <div className={"px-4 pt-8"}>
                    <h1 className={"text-2xl text-justify md:font-semibold"}>{post.title}</h1>
                    <div className={"flex justify-between"}>
                        <div className={"flex flex-wrap"}>
                            <p className={"text-secondary-600 whitespace-nowrap"}>{t.posts.sourceName} :&nbsp;</p>
                            <a href={post.sourceLink} target={"_blank"} className={"text-primary-400 underline"}
                               rel={"noopener noreferrer"}>{capitalize(post.sourceName)}</a>
                        </div>
                        <div>
                            <p className={"text-secondary-600 text-right"}>{postedDate}</p>
                        </div>
                    </div>
                    <div className={"flex justify-between pt-2"}>
                        {post.categories.map((cat, i) => {
                            if (i < 3) return <CategoryInput key={i} category={cat} />
                        })}
                    </div>
                    <div className={"flex justify-between mt-4"}>
                        <LikePostButton post={post} />
                        {user.role >= IUserRole.ADMIN && <div className={"flex"}>
							<Trash callback={toggle} />
							<Edit callback={toggleUpdate} />
						</div>}
                    </div>
                    {post.desc.split(/\r\n|\r|\n/g).map((s, i) => {
                        return <p data-content={`desc-${i}`}
                                  className={className("text-justify text-lg", i === 0 ? 'pt-3 first-letter:pl-5 first-letter:font-extrabold' : '')}
                                  key={i}>{s} <br /></p>
                    })}
                </div>
                <hr className={"my-4"} />
                <div className={"px-4"}>
                    <Comments post={post} />
                </div>
            </div>
        </>
    );
};

export default SinglePost;