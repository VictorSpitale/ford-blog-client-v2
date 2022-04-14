import React from 'react';
import Image from "next/image";
import {getPostCardImg} from "../../shared/images/postCardImg";
import {capitalize} from "../../shared/utils/string.utils";
import CategoryInput from "../CategoryInput";
import LikePostButton from "./like/LikePostButton";
import {className} from "../../shared/utils/class.utils";
import {IPost} from "../../shared/types/post.type";
import {blurImg} from "../../shared/images/blurImg";
import Trash from "../shared/icons/Trash";
import Edit from "../shared/icons/Edit";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {IUserRole} from "../../shared/types/user.type";
import {useModal, useTranslation} from "../../shared/hooks";
import {getTimeSinceMsg, timeSince} from "../../shared/utils/date.utils";
import Modal from "../modal/Modal";
import Cross from "../shared/icons/Cross";
import {cleanPost, deletePost} from "../../context/actions/posts.actions";
import {useRouter} from "next/router";

const SinglePost = ({post}: { post: IPost }) => {
    const t = useTranslation();
    const timeSinceObj = timeSince(post.createdAt)
    const {user} = useAppSelector(state => state.user)
    const {pending} = useAppSelector(state => state.lastPosts)
    const dispatch = useAppDispatch();
    const {toggle, isShowing} = useModal();
    const router = useRouter();

    const timeSinceMsg = () => {
        return getTimeSinceMsg(t, timeSinceObj);
    }

    const handleDelete = async () => {
        await dispatch(deletePost(post.slug)).then(async () => {
            await router.push("/");
            await dispatch(cleanPost());
        })
    }

    return (
        <>
            <Modal hide={toggle} isShowing={isShowing}>
                <div className={"flex justify-center"}>
                    <Cross />
                </div>
                <div className={"p-5"}>
                    <p className={"text-red-500 text-2xl font-extrabold text-center"}>{t.common.warning}</p>
                    <p className={"text-justify"}>{t.posts.delete.before}
                        <span className={"text-red-400 font-bold"}>
                            {t.posts.delete.deleteAction}
                        </span>
                        {t.posts.delete.after}
                        <span className={"underline"}>{post.title}</span>
                    </p>

                    <div className={"flex justify-around pt-3"}>
                        <button onClick={handleDelete}
                                className={"px-5 py-2 rounded text-white bg-red-500"}>{pending ? t.posts.delete.deleteLoading : capitalize(t.posts.delete.deleteAction)}
                        </button>
                        <button onClick={toggle}
                                className={"px-5 py-2 rounded bg-gray-300"}>{t.posts.delete.cancel}</button>
                    </div>
                </div>
            </Modal>
            <div
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
                            <p className={"text-secondary-600 text-right"}>{timeSinceMsg()}</p>
                        </div>
                    </div>
                    <div className={"flex justify-between pt-2"}>
                        {post.categories.map((cat, i) => {
                            if (i < 3) return <CategoryInput key={i} category={cat} />
                        })}
                    </div>
                    <div className={"flex justify-between"}>
                        <LikePostButton post={post} />
                        {user.role >= IUserRole.POSTER && <div className={"flex"}>
							<Trash callback={toggle} />
							<Edit />
						</div>}
                    </div>
                    {post.desc.split(/(?:\r\n|\r|\n)/g).map((s, i) => {
                        return <p
                            className={className("text-justify text-lg", i === 0 ? 'pt-3 first-letter:pl-5 first-letter:font-extrabold' : '')}
                            key={i}>{s} <br /></p>
                    })}
                </div>
            </div>
        </>
    );
};

export default SinglePost;