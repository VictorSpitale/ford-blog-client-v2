import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import Layout from "../../components/layouts/Layout";
import {isEmpty} from "../../shared/utils/object.utils";
import {IUserRole} from "../../shared/types/user.type";
import {NextPage} from "next";
import BaseView from "../../components/shared/BaseView";
import Link from 'next/link'
import SEO from "../../components/shared/seo";
import WritePost from "../../components/posts/WritePost";
import {useTranslation} from "../../shared/hooks";
import {setError} from "../../context/actions/errors.actions";

const Write = () => {

    const {user} = useAppSelector(state => state.user);

    const {categories: selectedCategories} = useAppSelector(state => state.selectCategories);
    const {categories, pending: categoriesPending} = useAppSelector(state => state.categories);
    const {pending} = useAppSelector(state => state.post);

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const canAccess = () => {
        return (!isEmpty(user) && user.role >= IUserRole.POSTER);
    }

    useEffect(() => {
        return () => {
            dispatch(setError({key: "writePageError", error: ""}))
        }
    }, [dispatch])

    if (!canAccess()) {
        return (
            <>
                <SEO title={""} shouldIndex={false} />
                <div data-content={"un-auth"} className={"w-3/4 m-auto pt-11"}>
                    <BaseView>
                        <h1 className={"text-lg md:text-2xl text-center"}>{t.posts.create.cantAccess}</h1>
                        <Link href={"/"} passHref>
                            <a className={"underline mx-auto block text-center"}>{t.common.backHome}</a>
                        </Link>
                    </BaseView>
                </div>
            </>
        )
    }

    return (
        <>
            <SEO title={t.posts.create.title} shouldIndex={false} />
            <WritePost pending={pending} selectedCategories={selectedCategories} categories={categories}
                       categoriesPending={categoriesPending} />
        </>
    );
};

export default Write;

/* istanbul ignore next */
Write.getLayout = function (page: NextPage) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}