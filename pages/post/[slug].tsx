import React from 'react';
import {useAppSelector} from "../../context/hooks";
import {wrapper} from "../../context/store";
import {getPost} from "../../context/actions/posts.actions";
import {isEmpty} from "../../shared/utils/object.utils";
import Head from "next/head";
import DefaultErrorPage from 'next/error'
import Header from "../../components/Header";
import SEO from "../../components/seo";
import {getFirstSentence} from "../../shared/utils/string.utils";
import SinglePost from "../../components/posts/SinglePost";

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

PostPage.getInitialProps = wrapper.getInitialPageProps(
    ({dispatch, getState}) =>
        async (context) => {
            if (context.query.slug === "last" && context.res && context.res.statusCode) {
                context.res.statusCode = 404
                return;
            }
            await dispatch(getPost(context.query.slug as string));
            const {error} = getState().post
            if (error && context.res && context.res.statusCode) {
                context.res.statusCode = 404
            }
        }
);
