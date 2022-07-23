import React, {useCallback, useEffect, useState} from 'react';
import BaseView from "../../shared/BaseView";
import {useModal, useTranslation} from "../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {deletePost, getPosts} from "../../../context/actions/posts/posts.actions";
import RenderIf from "../../shared/RenderIf";
import {isEmpty} from "../../../shared/utils/object.utils";
import Table from "../../table/Table";
import {IPost} from "../../../shared/types/post.type";
import UpdatePostModal from "../../posts/modals/UpdatePostModal";
import DeletePostModal from "../../posts/modals/DeletePostModal";
import DetailsModal from "../modals/details/DetailsModal";
import Button from "../../shared/Button";

const PostsView = () => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const {paginatedPosts, pending} = useAppSelector(state => state.posts);

    const {toggle: toggleEditPost, isShowing: isEditPostShowing} = useModal();
    const {toggle: toggleDeletePost, isShowing: isDeletePostShowing} = useModal();
    const {
        toggle: toggleDetailsPost,
        isShowing: isDetailsPostShowing,
        addOtherModal,
        otherModal,
        previous,
        hasPrevious
    } = useModal();

    const [activePost, setActivePost] = useState({} as IPost);

    const fetchPosts = useCallback(async () => {
        /* istanbul ignore else */
        if (paginatedPosts.hasMore) {
            await dispatch(getPosts(paginatedPosts.page + 1));
        }
    }, [dispatch, paginatedPosts.hasMore, paginatedPosts.page]);

    useEffect(() => {
        /* istanbul ignore else */
        if (paginatedPosts.page === 0) fetchPosts();
    }, []);

    const openDetails = useCallback((post: IPost) => {
        setActivePost({...post});
        toggleDetailsPost();
    }, []);

    const openEdit = useCallback((post: IPost) => {
        setActivePost({...post});
        toggleEditPost();
    }, []);

    const openDelete = useCallback((post: IPost) => {
        setActivePost({...post});
        toggleDeletePost();
    }, [])

    const handleDeletePost = useCallback(async () => {
        await dispatch(deletePost(activePost.slug)).then(() => {
            toggleDeletePost();
        });
    }, [activePost.slug, dispatch, toggleDeletePost]);

    return (
        <>
            <RenderIf condition={isDetailsPostShowing}>
                <DetailsModal isShowing={isDetailsPostShowing} toggle={toggleDetailsPost}
                              content={{type: "posts", data: activePost}} otherModal={otherModal}
                              setOtherModal={addOtherModal}
                              hasPrevious={hasPrevious} previous={previous} />
            </RenderIf>
            <RenderIf condition={isDeletePostShowing}>
                <DeletePostModal toggle={toggleDeletePost} isShowing={isDeletePostShowing} pending={pending}
                                 handleDelete={handleDeletePost}
                                 post={activePost} />
            </RenderIf>
            <RenderIf condition={isEditPostShowing}>
                <UpdatePostModal post={activePost} toggle={toggleEditPost} isShowing={isEditPostShowing}
                                 pending={pending} />
            </RenderIf>
            <BaseView>
                <div className={"flex items-center mb-4"}>
                    <h1 className={"text-2xl font-semibold"}>{t.admin.posts.title}</h1>
                    <RenderIf condition={pending}>
                        <p className={"italic ml-4"}>{t.common.loading}</p>
                    </RenderIf>
                </div>
                <RenderIf condition={isEmpty((paginatedPosts.posts))}>
                    <p>{t.common.noPost}</p>
                </RenderIf>
                <RenderIf condition={!isEmpty((paginatedPosts.posts))}>
                    <Table keys={[
                        {key: "title", label: t.admin.tabs.title},
                        {key: "likes", label: t.admin.tabs.likes, hideOnMobile: true},
                        {key: "comments", label: t.admin.tabs.comments, operation: "count", hideOnMobile: true},
                        {key: "createdAt", label: t.admin.tabs.date, operation: "date"}
                    ]} data={paginatedPosts.posts} sortable={true} onOpen={openDetails} actions={[
                        {
                            label: t.common.update,
                            color: "primary",
                            onClick: openEdit
                        }, {
                            label: t.common.delete,
                            onClick: openDelete,
                            color: "danger"
                        }
                    ]}
                    />
                </RenderIf>
                <RenderIf condition={paginatedPosts.hasMore}>
                    <div className={"flex justify-center mt-5"}>

                        <Button element={"button"} text={pending ? t.common.loading : t.common.loadMore}
                                onClick={() => fetchPosts()} />
                    </div>
                </RenderIf>
            </BaseView>
        </>
    );
};

export default PostsView;