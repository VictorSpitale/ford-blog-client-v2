import React, {useCallback, useEffect} from 'react';
import Layout from "../../components/layouts/Layout";
import {NextPage} from "next";
import {useAppDispatch, useAppSelector} from "../../context/hooks";

import CategoriesSlider from "../../components/categories/slider/CategoriesSlider";
import {getCategories, setCategorySlide} from "../../context/actions/categories/categories.actions";
import SEO from "../../components/shared/seo";
import {useTranslation} from "../../shared/hooks";
import {getCategorizedPosts} from "../../context/actions/posts/posts.actions";
import PostsList from "../../components/posts/PostsList";
import {isEmpty} from "../../shared/utils/object.utils";
import {useRouter} from "next/router";
import RenderIf from "../../components/shared/RenderIf";

const Index = () => {

    const dispatch = useAppDispatch();
    const {posts, pending} = useAppSelector(state => state.categorizedPosts);
    const {category} = useAppSelector(state => state.categorySlide);
    const {categories} = useAppSelector(state => state.categories);

    const t = useTranslation();
    const router = useRouter();

    const getPosts = () => {
        if (!category) {
            return [];
        }
        const list = posts.find((list) => list.category._id === category._id);
        if (!list) return [];
        return list.posts;
    }

    const changeActiveCategorySlide = () => {
        /* istanbul ignore else */
        if (router.query.selected !== category?.name) {
            dispatch(setCategorySlide({category: categories.find((cat) => cat.name === router.query.selected)}));
        }
    }

    const fetchCategories = useCallback(async () => {
        await dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        fetchCategories();
        return () => {
            dispatch(setCategorySlide({category: undefined}));
        }
    }, [dispatch, fetchCategories]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (category) {
                await dispatch(getCategorizedPosts(category));
            }
        }
        fetchPosts();
    }, [category, dispatch]);

    return (
        <>
            <SEO title={t.categories.title} />
            <CategoriesSlider categories={categories} category={category}
                              handleCategoryChange={changeActiveCategorySlide} />
            <div className={"pt-8"}>
                <RenderIf condition={pending}>
                    <p className={"text-center"}>{t.common.loading}</p>
                </RenderIf>
                {(isEmpty(getPosts())) ? <p className={"text-center"}>{t.categories.noPost}</p> :
                    <div className={"px-1 mx-auto w-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4"}>
                        <PostsList posts={getPosts()} />
                    </div>}
            </div>
        </>
    );
};

export default Index;

/* istanbul ignore next */
Index.getLayout = function (page: NextPage) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}