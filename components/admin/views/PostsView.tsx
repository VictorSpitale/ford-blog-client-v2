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
import DetailsModal from "../modals/DetailsModal";

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

    const [editingPost, setEditingPost] = useState({} as IPost);
    const [deletingPost, setDeletingPost] = useState({} as IPost);
    const [detailsPost, setDetailsPost] = useState({} as IPost);

    const fetchPosts = useCallback(async () => {
        if (paginatedPosts.hasMore) {
            await dispatch(getPosts(paginatedPosts.page + 1));
        }
    }, [dispatch, paginatedPosts.hasMore, paginatedPosts.page]);

    // Clear on unmount
    useEffect(() => {
        return () => {
            setEditingPost({} as IPost);
            setDeletingPost({} as IPost);
            // setDetailsPost({} as IPost);
        }
    }, []);

    // Toggle Edit Post
    useEffect(() => {
        if (!isEmpty(editingPost)) {
            toggleEditPost();
        }
    }, [editingPost])

    // Toggle Delete Post
    useEffect(() => {
        if (!isEmpty(deletingPost)) {
            toggleDeletePost();
        }
    }, [deletingPost])

    // Toggle Details Post
    useEffect(() => {
        if (!isEmpty(detailsPost)) {
            toggleDetailsPost();
        }
    }, [detailsPost])

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const openDetails = useCallback((post: IPost) => {
        setDetailsPost({...post});
    }, []);

    const openEdit = useCallback((post: IPost) => {
        setEditingPost({...post});
    }, []);

    const openDelete = useCallback((post: IPost) => {
        setDeletingPost({...post});
    }, [])

    const handleDeletePost = useCallback(async () => {
        await dispatch(deletePost(deletingPost.slug)).then(() => {
            toggleDeletePost();
        });
    }, [deletingPost.slug, dispatch, toggleDeletePost]);

    return (
        <>
            <DetailsModal isShowing={isDetailsPostShowing} toggle={toggleDetailsPost}
                          content={{type: "posts", data: detailsPost}} otherModal={otherModal}
                          setOtherModal={addOtherModal}
                          hasPrevious={hasPrevious} previous={previous} />
            <DeletePostModal toggle={toggleDeletePost} isShowing={isDeletePostShowing} pending={pending}
                             handleDelete={handleDeletePost}
                             post={deletingPost} />
            <UpdatePostModal post={editingPost} toggle={toggleEditPost} isShowing={isEditPostShowing}
                             pending={pending} />
            <BaseView>
                <div className={"flex items-center mb-4"}>
                    <h1 className={"text-2xl font-semibold"}>{t.admin.posts.title}</h1>
                    <RenderIf condition={pending}>
                        <p className={"italic ml-4"}>Chargement...</p>
                    </RenderIf>
                </div>
                <RenderIf condition={isEmpty((paginatedPosts.posts))}>
                    <p>Aucun article disponible</p>
                </RenderIf>
                <RenderIf condition={!isEmpty((paginatedPosts.posts))}>
                    <Table keys={[
                        {key: "title", label: "Titre"},
                        {key: "likes", label: "J'aimes"},
                        {key: "comments", label: "Commentaires", operation: "count"},
                        {key: "createdAt", label: "Date", operation: "date"}
                    ]} data={paginatedPosts.posts} sortable={true} onOpen={openDetails} actions={[
                        {
                            label: "Modifier",
                            color: "primary",
                            onClick: openEdit
                        }, {
                            label: "Supprimer",
                            onClick: openDelete,
                            color: "danger"
                        }
                    ]}
                    />
                </RenderIf>
            </BaseView>
        </>
    );
};

export default PostsView;