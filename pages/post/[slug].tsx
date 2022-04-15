import React from 'react';
import {useAppSelector} from "../../context/hooks";
import {wrapper} from "../../context/store";
import Header from "../../components/shared/Header";
import SEO from "../../components/shared/seo";
import {getFirstSentence} from "../../shared/utils/string.utils";
import SinglePost from "../../components/posts/SinglePost";
import {getPost} from "../../context/actions/posts.actions";
import Error from "../_error";
import {ErrorProps} from "../../shared/types/errors.type";
import {isEmpty} from "../../shared/utils/object.utils";
import {useTranslation} from "../../shared/hooks";

const PostPage = ({error}: ErrorProps) => {
    const {post} = useAppSelector((state => state.post))
    const t = useTranslation();
    if (error || isEmpty(post)) {
        return (
            <Error statusCode={error?.statusCode || 404}
                   customMessage={error?.customMessage || t.posts["404"]} />
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
                return {error: {statusCode: 404}} as ErrorProps
            }
            await dispatch(getPost({slug: context.query.slug as string, context}));
            const {error} = getState().post
            if (error && context.res && context.res.statusCode) {
                return {error: {statusCode: 404}} as ErrorProps
            }
        }
);

