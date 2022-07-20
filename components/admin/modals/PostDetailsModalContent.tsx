import React, {useEffect, useState} from 'react';
import {AnyFunction} from "../../../shared/types/props.type";
import {IPost} from "../../../shared/types/post.type";
import Image from "next/image";
import {getPostCardImg} from "../../../shared/images/postCardImg";
import RenderIf from "../../shared/RenderIf";
import {blurImg} from "../../../shared/images/blurImg";
import {className} from "../../../shared/utils/class.utils";
import Tabs from "../../tabs/Tabs";
import Link from "next/link";
import {formateDate} from "../../../shared/utils/date.utils";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {getPostLikers} from "../../../context/actions/admin/admin.actions";
import {isEmpty} from "../../../shared/utils/object.utils";
import {IBasicUser} from "../../../shared/types/user.type";
import ProfilePicture from "../../shared/ProfilePicture";
import {getUserPictureSrc} from "../../../shared/images/ProfilePicture";
import UserDetailsModalContent from "./UserDetailsModalContent";
import {useTranslation} from "../../../shared/hooks";
import {useRouter} from "next/router";
import {ICategory} from "../../../shared/types/category.type";
import CategoryDetailsModalContent from "./CategoryDetailsModalContent";

type PropsType = {
    setOtherModal: AnyFunction;
    post: IPost
}

const PostDetailsModalContent = ({post, setOtherModal}: PropsType) => {

    const {posts, pending} = useAppSelector(state => state.adminPostsLikers);

    const dispatch = useAppDispatch();
    const t = useTranslation();
    const router = useRouter();

    const [likers, setLikers] = useState<IBasicUser[]>([]);

    const navigateToUser = (id: string) => {
        setOtherModal(
            <UserDetailsModalContent setOtherModal={setOtherModal} needFetch={true} userId={id} />
        )
    }

    const navigateToCategory = (category: ICategory) => {
        setOtherModal(
            <CategoryDetailsModalContent setOtherModal={setOtherModal} category={category} />
        )
    }

    useEffect(() => {
        const fetchLikers = async () => {
            await dispatch(getPostLikers(post.slug));
        }
        fetchLikers();
    }, []);

    useEffect(() => {
        const found = posts.find((p) => p.slug === post.slug);
        if (found) setLikers(found.likers);
    }, [post.slug, posts]);

    return (
        <div className={"px-4 py-2"}>
            <div className={"flex gap-x-4"}>
                <div className={"w-1/2"}>
                    <div>
                        <RenderIf condition={!!post.picture}>
                            <div className={"overflow-hidden rounded-2xl w-full h-[300px] relative"}>
                                <Image alt={post.title} src={getPostCardImg(post)} layout={"fill"} objectFit={"cover"}
                                       placeholder={"blur"} blurDataURL={blurImg} />
                            </div>
                        </RenderIf>
                        <h1 className={"mt-5 text-center text-lg md:text-2xl text-justify md:font-semibold"}>{post.title}</h1>
                    </div>
                </div>
                <div className={"w-1/2 max-h-[450px] overflow-auto c-scroll"}>
                    <Tabs>
                        <div data-label={t.admin.posts.tabs.informations}
                             className={className("[&>*]:flex [&>*]:justify-between [&>*]:gap-x-3 [&>*]:mb-4",
                                 "[&>*>p:first-child]:font-semibold [&>*>p:last-child]:text-right")}>
                            <div>
                                <p>ID</p>
                                <p>{post._id}</p>
                            </div>
                            <div>
                                <p>{t.admin.posts.fields.slug}</p>
                                <Link href={`/post/${post.slug}`} passHref={true}>
                                    <p className={"underline text-blue-400 cursor-pointer"}>{post.slug}</p>
                                </Link>
                            </div>
                            <div>
                                <p>{t.admin.posts.fields.source}</p>
                                <a href={post.sourceLink}>
                                    <p className={"underline text-blue-400"}>{post.sourceName}</p>
                                </a>
                            </div>
                            <div>
                                <p>{t.admin.posts.fields.categories}</p>
                                <p>
                                    {post.categories.map((cat, i) => {
                                        return (
                                            <span key={i}>
                                                <span onClick={() => navigateToCategory(cat)}
                                                      className={"underline text-blue-400 cursor-pointer"}>
                                                    {cat.name}
                                                </span>
                                                {i !== post.categories.length - 1 ? ", " : ""}
                                            </span>
                                        )
                                    })}
                                </p>
                            </div>
                            <div>
                                <p>{t.admin.posts.fields.likeCount}</p>
                                <p>{post.likes}</p>
                            </div>
                            <div>
                                <p>{t.admin.posts.fields.commentCount}</p>
                                <p>{post.comments.length}</p>
                            </div>
                            <div>
                                <p>{t.admin.posts.fields.createdAt}</p>
                                <p>{formateDate(post.createdAt, router.locale)}</p>
                            </div>
                            <div>
                                <p>{t.admin.posts.fields.updatedAt}</p>
                                <p>{formateDate(post.updatedAt, router.locale)}</p>
                            </div>
                        </div>
                        <div data-label={t.admin.posts.tabs.likes}
                             className={className("[&>*]:mb-4")}>
                            <RenderIf condition={pending}>
                                <p className={"italic"}>{t.common.loading}</p>
                            </RenderIf>
                            <RenderIf condition={isEmpty(likers)}>
                                <p>{t.posts.noLike}</p>
                            </RenderIf>
                            <RenderIf condition={!isEmpty(likers)}>
                                {likers.map((user, i) => {
                                    return (
                                        <div key={i}>
                                            <div className={"flex items-center gap-x-4"}>
                                                <ProfilePicture src={getUserPictureSrc(user).src} />
                                                <p onClick={() => navigateToUser(user._id)}
                                                   className={"text-blue-400 underline cursor-pointer"}>{user.pseudo}</p>
                                            </div>
                                            <RenderIf condition={i !== likers.length - 1}>
                                                <hr className={"mt-4"} />
                                            </RenderIf>
                                        </div>
                                    )
                                })}
                            </RenderIf>
                        </div>
                        <div data-label={t.admin.posts.tabs.comments}
                             className={className("[&>*]:mb-4")}>
                            <RenderIf condition={isEmpty(post.comments)}>
                                <p>{t.posts.noComment}</p>
                            </RenderIf>
                            <RenderIf condition={!isEmpty(post.comments)}>
                                {post.comments.map((comment, i) => {
                                    return (
                                        <div key={i}>
                                            <div className={"flex gap-x-4"}>
                                                <div>
                                                    <ProfilePicture src={getUserPictureSrc(comment.commenter).src} />
                                                </div>
                                                <div>
                                                    <p onClick={() => navigateToUser(comment.commenter._id)}
                                                       className={"text-blue-400 underline cursor-pointer"}>
                                                        {comment.commenter.pseudo}
                                                    </p>
                                                    <p>{comment.comment}</p>
                                                </div>
                                            </div>
                                            <RenderIf condition={i !== post.comments.length - 1}>
                                                <hr className={"mt-4"} />
                                            </RenderIf>
                                        </div>
                                    )
                                })}
                            </RenderIf>
                        </div>
                    </Tabs>
                </div>
            </div>
            <div className={"max-h-[100px] overflow-auto c-scroll mt-5"}>
                {post.desc.split(/\r\n|\r|\n/g).map((s, i) => {
                    return <p
                        className={className("text-justify text-lg", i === 0 ? 'pt-3 first-letter:pl-5 first-letter:font-extrabold' : '')}
                        key={i}>{s} <br /></p>
                })}
            </div>
        </div>
    );
};

export default PostDetailsModalContent;