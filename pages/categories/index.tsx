import React, {useEffect} from 'react';
import Layout from "../../components/layouts/Layout";
import {NextPage} from "next";
import {useAppDispatch, useAppSelector} from "../../context/hooks";

import CategoriesSlider from "../../components/categories/slider/CategoriesSlider";
import {getCategories, setCategorySlide} from "../../context/actions/categories.actions";
import SEO from "../../components/shared/seo";
import {wrapper} from "../../context/store";
import {useTranslation} from "../../shared/hooks";
import {getCategorizedPosts} from "../../context/actions/posts.actions";
import PostsList from "../../components/posts/PostsList";
import {isEmpty} from "../../shared/utils/object.utils";

const Index = () => {

    const dispatch = useAppDispatch();
    const {posts, loading} = useAppSelector(state => state.categorizedPosts);
    const {category} = useAppSelector(state => state.categorySlide);
    const t = useTranslation();

    useEffect(() => {
        return () => {
            dispatch(setCategorySlide({category: undefined}));
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (category) {
                await dispatch(getCategorizedPosts(category.name));
            }
        }
        fetchPosts();
    }, [category, dispatch]);

    const getPosts = () => {
        if (!category) {
            if (!isEmpty(posts)) return posts[0].posts;
            return [];
        }
        const list = posts.find((list) => list.category === category.name);
        if (!list) return [];
        return list.posts;
    }

    return (
        <>
            <SEO title={t.categories.title} />
            <CategoriesSlider />
            <div className={"pt-8"}>
                {loading && <p className={"text-center"}>{t.common.loading}</p>}
                {(isEmpty(getPosts())) ? <p className={"text-center"}>{t.categories.noPost}</p> :
                    <div className={"px-1 mx-auto w-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4"}>
                        <PostsList posts={getPosts()} />
                    </div>}
            </div>
        </>
    );
};

export default Index;

Index.getLayout = function (page: NextPage) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

Index.getInitialProps = wrapper.getInitialPageProps(
    ({dispatch}) =>
        async (context) => {
            if (context.query.selected) {
                const name = (typeof context.query.selected === "string" ? context.query.selected : context.query.selected[0]);
                await dispatch(getCategorizedPosts(name));
            }
            await dispatch(getCategories());
        }
);
