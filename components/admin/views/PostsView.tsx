import React, {useCallback, useEffect} from 'react';
import BaseView from "../../shared/BaseView";
import {useTranslation} from "../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {getPosts} from "../../../context/actions/posts.actions";
import RenderIf from "../../shared/RenderIf";
import {isEmpty} from "../../../shared/utils/object.utils";
import Table from "../../table/Table";
import {IPost} from "../../../shared/types/post.type";

const PostsView = () => {

    const t = useTranslation();
    const dispatch = useAppDispatch();
    const {paginatedPosts, pending} = useAppSelector(state => state.posts);

    const fetchPosts = useCallback(async () => {
        if (paginatedPosts.hasMore) {
            await dispatch(getPosts(paginatedPosts.page + 1));
        }
    }, [dispatch, paginatedPosts.hasMore, paginatedPosts.page]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const openDetails = useCallback((post: IPost) => {
        console.log("details :", post);
    }, []);

    const openEdit = useCallback((post: IPost) => {
        console.log("edition :", post)
    }, [])

    const openDelete = useCallback((post: IPost) => {
        console.log("suppression :", post)
    }, [])

    return (
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
    );
};

export default PostsView;