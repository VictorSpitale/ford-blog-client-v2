import React, {useCallback, useEffect, useState} from 'react';
import {displayRole, IUser} from "../../../shared/types/user.type";
import {AnyFunction} from "../../../shared/types/props.type";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {getFilteredCommentedPostByUserId, getUserById} from "../../../context/actions/admin/admin.actions";
import RenderIf from "../../shared/RenderIf";
import {useTranslation} from "../../../shared/hooks";
import {isEmpty} from "../../../shared/utils/object.utils";
import Image from "next/image";
import {getUserPictureSrc} from "../../../shared/images/ProfilePicture";
import {getLikedPosts} from "../../../context/actions/posts/posts.actions";
import Tabs from "../../tabs/Tabs";
import {className} from "../../../shared/utils/class.utils";
import {formateDate} from "../../../shared/utils/date.utils";
import {useRouter} from "next/router";
import {IPost} from "../../../shared/types/post.type";
import {getPostCardImg} from "../../../shared/images/postCardImg";
import PostDetailsModalContent from "./PostDetailsModalContent";

type PropsType = { setOtherModal: AnyFunction; } & (
    { needFetch: true; userId: string; }
    | { needFetch: false; user: IUser; }
    );
const UserDetailsModalContent = (props: PropsType) => {

    const [user, setUser] = useState({} as IUser);
    const [likedPosts, setLikedPosts] = useState<IPost[]>([]);
    const [commentedPosts, setCommentedPosts] = useState<IPost[]>([]);

    const {users, pending} = useAppSelector(state => state.users);
    const {users: usersLikedPosts, pending: likedPostsPending} = useAppSelector(state => state.likedPosts);
    const {
        users: usersCommentedPosts,
        pending: commentedPostsPending
    } = useAppSelector(state => state.adminCommentedPosts);

    const dispatch = useAppDispatch();
    const t = useTranslation();
    const router = useRouter();

    const navigateToPost = (post: IPost) => {
        props.setOtherModal(
            <PostDetailsModalContent setOtherModal={props.setOtherModal} post={post} />
        )
    }

    const fetchUser = useCallback(async () => {
        if (props.needFetch) {
            await dispatch(getUserById(props.userId));
        }
    }, [dispatch, props.needFetch]);

    const fetchLikedPosts = useCallback(async (userId) => {
        await dispatch(getLikedPosts(userId));
    }, [dispatch]);

    const fetchCommentedPosts = useCallback(async (userId) => {
        await dispatch(getFilteredCommentedPostByUserId(userId));
    }, [dispatch]);

    // set Posts on usersLikedPosts is fetched 
    useEffect(() => {
        if (!isEmpty(user)) {
            const found = usersLikedPosts.find((u) => u.userId === user._id);
            if (found) setLikedPosts(found.posts);
        }
    }, [user._id, usersLikedPosts]);

    // set Posts on commentedPosts is fetched
    useEffect(() => {
        if (!isEmpty(user)) {
            const found = usersCommentedPosts.find((u) => u.userId === user._id);
            if (found) setCommentedPosts(found.posts);
        }
    }, [user._id, usersCommentedPosts]);

    // If fetched users, set the user
    useEffect(() => {
        let found;
        if (props.needFetch) {
            found = users.find((u) => u._id === props.userId);
        }
        if (found) {
            setUser(found);
            fetchLikedPosts(found._id);
            fetchCommentedPosts(found._id);
        }
    }, [props.needFetch, users]);

    // Fetch or set the user on mount
    useEffect(() => {
        if (props.needFetch) {
            fetchUser();
        } else {
            setUser(props.user);
            fetchLikedPosts(props.user._id);
            fetchCommentedPosts(props.user._id);
        }
    }, []);

    return (
        <div className={"px-4 py-2"}>
            <RenderIf condition={pending}>
                <p className={"italic"}>{t.common.loading}</p>
            </RenderIf>
            <RenderIf condition={isEmpty(user)}>
                <p>{t.common.noUser}</p>
            </RenderIf>
            <RenderIf condition={!isEmpty(user)}>
                <div className={"flex gap-x-4"}>
                    <div className={"w-1/3 bg-red-500f flex items-center flex-col"}>
                        <div className={"relative rounded-lg overflow-hidden h-[200px] w-[200px]"}>
                            <Image alt={`${user.pseudo} profile picture`} src={getUserPictureSrc(user).src}
                                   layout={"fill"} objectFit={"cover"} />
                        </div>
                        <p className={"font-bold text-2xl mt-3"}>{user.pseudo}</p>
                    </div>
                    <div className={"w-full"}>
                        <Tabs>
                            <div data-label={t.admin.users.tabs.informations}
                                 className={className("[&>*]:flex [&>*]:justify-between [&>*]:gap-x-3 [&>*]:mb-4",
                                     "[&>*>p:first-child]:font-semibold [&>*>p:last-child]:text-right")}>
                                <div>
                                    <p>ID</p>
                                    <p>{user._id}</p>
                                </div>
                                <div>
                                    <p>{t.account.profile.email}</p>
                                    <p>{user.email}</p>
                                </div>
                                <div>
                                    <p>{t.account.profile.role}</p>
                                    <p>{displayRole(user.role, t)}</p>
                                </div>
                                <div>
                                    <p>{t.account.profile.firstLogin}</p>
                                    <p>{formateDate(user.createdAt, router.locale)}</p>
                                </div>
                                <div>
                                    <p>{t.account.profile.lastUpdate}</p>
                                    <p>{formateDate(user.updatedAt, router.locale)}</p>
                                </div>
                            </div>
                            <div data-label={t.admin.users.tabs.likes}>
                                <RenderIf condition={likedPostsPending}>
                                    <p className={"italic"}>{t.common.loading}</p>
                                </RenderIf>
                                <RenderIf condition={isEmpty(likedPosts)}>
                                    <p>{t.posts.noLiked}</p>
                                </RenderIf>
                                <RenderIf condition={!isEmpty(likedPosts)}>
                                    {likedPosts.map((p, i) => {
                                        return (
                                            <div key={i}>
                                                <div className={"flex items-center gap-x-4"}>
                                                    <div
                                                        className={"relative min-w-[50px] h-[50px] rounded-lg  overflow-hidden"}>
                                                        <Image src={getPostCardImg(p)} layout={"fill"}
                                                               objectFit={"cover"}
                                                               alt={p.title} />
                                                    </div>
                                                    <p onClick={() => navigateToPost(p)}
                                                       className={"text-blue-400 underline cursor-pointer"}>{p.title}</p>
                                                </div>
                                                <RenderIf condition={i !== likedPosts.length - 1}>
                                                    <hr className={"mt-4"} />
                                                </RenderIf>
                                            </div>
                                        )
                                    })}
                                </RenderIf>
                            </div>
                            <div data-label={t.admin.users.tabs.comments}>
                                <RenderIf condition={commentedPostsPending}>
                                    <p className={"italic"}>{t.common.loading}</p>
                                </RenderIf>
                                <RenderIf condition={isEmpty(commentedPosts)}>
                                    <p>{t.posts.noLiked}</p>
                                </RenderIf>
                                <RenderIf condition={!isEmpty(commentedPosts)}>
                                    {commentedPosts.map((post, i) => {
                                        return (
                                            <div key={i}>
                                                <div>
                                                    <div className={"flex items-center gap-x-4"}>
                                                        <div
                                                            className={"relative min-w-[50px] h-[50px] rounded-lg  overflow-hidden"}>
                                                            <Image src={getPostCardImg(post)} layout={"fill"}
                                                                   objectFit={"cover"}
                                                                   alt={post.title} />
                                                        </div>
                                                        <p onClick={() => navigateToPost(post)}
                                                           className={"text-blue-400 underline cursor-pointer"}>{post.title}</p>
                                                    </div>
                                                    {post.comments.filter((com) => com.commenter._id === user._id).map((com, j) => {
                                                        return (
                                                            <div key={j}>
                                                                <hr className={"my-2"} />
                                                                <p>{com.comment}</p>
                                                                <p className={"text-right"}>{t.admin.posts.fields.createdAt} {formateDate(com.createdAt, router.locale)}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <RenderIf condition={i !== commentedPosts.length - 1}>
                                                    <hr className={"my-4"} />
                                                </RenderIf>
                                            </div>
                                        )
                                    })}
                                </RenderIf>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </RenderIf>
        </div>
    );
};

export default UserDetailsModalContent;