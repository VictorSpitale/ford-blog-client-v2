import React, {useCallback, useEffect, useRef, useState} from 'react';
import SEO from "../../components/shared/seo";
import BaseView from "../../components/shared/BaseView";
import Link from "next/link";
import {isEmpty} from "../../shared/utils/object.utils";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {useTranslation} from "../../shared/hooks";
import {NextPage} from "next";
import Layout from "../../components/layouts/Layout";
import {getPosts} from "../../context/actions/posts/posts.actions";
import PostCard from "../../components/posts/PostCard";
import RenderIf from "../../components/shared/RenderIf";

const News = () => {

    const {user} = useAppSelector(state => state.user);
    const {paginatedPosts, pending} = useAppSelector(state => state.posts);

    const t = useTranslation();
    const dispatch = useAppDispatch();
    const observer = useRef<IntersectionObserver | null>(null)

    const [page, setPage] = useState(1);

    const lastPostRef = useCallback((node) => {
        if (pending) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && paginatedPosts.hasMore) {
                setPage((prev) => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [pending, paginatedPosts.hasMore])

    useEffect(() => {
        const fetchPosts = async () => {
            await dispatch(getPosts(page));
        }
        if (!isEmpty(user)) fetchPosts();
    }, [user, page, dispatch]);

    if (isEmpty(user)) {
        return (
            <>
                <SEO title={""} shouldIndex={false} />
                <div className={"w-3/4 m-auto pt-11"}>
                    <BaseView>
                        <h1 className={"text-lg md:text-2xl text-center"}>{t.posts.news.cantAccess}</h1>
                        <Link href={"/login"} passHref>
                            <a className={"underline mx-auto block text-center"}>{t.login.connect}</a>
                        </Link>
                    </BaseView>
                </div>
            </>
        )
    }

    return (
        <>
            <SEO title={t.posts.news.title} shouldIndex={false}>
                {/*{paginatedPosts.hasMore && <link rel="next" href={`news?page=${page + 1}`} />}*/}
                {/*{page > 1 &&*/}
                {/*	<link rel="prev" href={`news?page=${page - 1}`} />*/}
                {/*}*/}
            </SEO>
            <div className={"w-fit flex-col mx-auto"}>
                {!isEmpty(paginatedPosts) && paginatedPosts.posts.map((post, index) => {
                    if (paginatedPosts.posts.length === index + 1) {
                        return <PostCard ref={lastPostRef} key={index} post={post} large={true} />
                    } else {
                        return <PostCard key={index} post={post} large={true} />
                    }
                })}
                <RenderIf condition={pending}>
                    <div className={"pb-8 text-center"}>{t.common.loading}</div>
                </RenderIf>
            </div>
        </>
    );
};

export default News;

/* istanbul ignore next */
News.getLayout = function (page: NextPage) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}