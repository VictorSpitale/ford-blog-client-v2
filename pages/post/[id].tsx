import React from 'react';
import {useAppSelector} from "../../context/hooks";
import {wrapper} from "../../context/store";
import {getPost} from "../../context/actions/posts.actions";

const SinglePost = () => {
    const {post} = useAppSelector((state => state.post))
    return (
        <div>
            {post.title}
        </div>
    );
};

export default SinglePost;

SinglePost.getInitialProps = wrapper.getInitialPageProps(
    ({dispatch}) =>
        async (context) => {
            await dispatch(getPost(context.query.id as string));
        }
);
