import React from 'react';
import {useAppSelector} from "../../context/hooks";
import {wrapper} from "../../context/store";
import {isEmpty} from "../../shared/utils/object.utils";
import Head from "next/head";
import DefaultErrorPage from 'next/error'
import Header from "../../components/shared/Header";
import SEO from "../../components/shared/seo";
import {getFirstSentence} from "../../shared/utils/string.utils";
import SinglePost from "../../components/posts/SinglePost";
import {getPost} from "../../context/actions/posts.actions";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const PostPage = () => {
    const {post} = useAppSelector((state => state.post))
    if (isEmpty(post)) {
        return (
            <>
                <Head>
                    <meta name={"robots"} content={"noindex"} />
                </Head>
                <DefaultErrorPage statusCode={404} />
            </>
        )
    }

    return (
        <>
            <Header />
            <SEO title={post.title} description={getFirstSentence(post.desc)} />
            <SinglePost post={post} />
        </>
    );
};

export default PostPage;

export const getServerSideProps = wrapper.getServerSideProps(store => async ({locale, params, req, res}) => {
    if (!params || !params.slug || params.slug === "last") {
        res.statusCode = 404
        return {
            props: {}
        };
    }
    await store.dispatch(getPost({slug: params.slug as string, req}));
    const {error} = store.getState().post
    if (error && res && res.statusCode) {
        res.statusCode = 404
        return {
            props: {}
        };
    }
    return {
        props: {
            ...await serverSideTranslations(locale as string, ['common', 'posts'])
        }
    }
});
