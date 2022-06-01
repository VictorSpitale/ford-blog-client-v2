import React, {ReactElement, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {wrapper} from "../../context/store";
import SEO from "../../components/shared/seo";
import {getFirstSentence} from "../../shared/utils/string.utils";
import SinglePost from "../../components/posts/SinglePost";
import {getPost, patchLikeStatus} from "../../context/actions/posts.actions";
import {ErrorProps} from "../../shared/types/errors.type";
import {isEmpty} from "../../shared/utils/object.utils";
import {NextPageWithLayout} from "../../shared/types/page.type";
import Layout from "../../components/layouts/Layout";
import {useRouter} from "next/router";

const PostPage: NextPageWithLayout<ErrorProps> = ({error}) => {
    const {post} = useAppSelector((state => state.post))
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (error || isEmpty(post)) {
            router.push('/404')
        }
        const patchStatus = async () => {
            await dispatch(patchLikeStatus(post.slug));
        }
        patchStatus();
    }, []);

    return (
        <>
            {(!error && !isEmpty(post)) &&
				<>
					<SEO title={post.title} description={getFirstSentence(post.desc)} />
					<SinglePost post={post} />
				</>}
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

PostPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}