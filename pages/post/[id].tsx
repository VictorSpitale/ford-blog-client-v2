import React from 'react';
import {IPost} from "../../shared/types/post.type";
import {GetServerSideProps} from "next";

const SinglePost = ({post}: { post: IPost }) => {
    return (
        <div>
            {post.title}
        </div>
    );
};

export default SinglePost;

export const getServerSideProps: GetServerSideProps = async (context) => {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    const posts = await fetch('http://localhost:5000/api/post').then(res => res.json())
    const post = posts.find((post: IPost) => post.slug == context.params?.id)
    if (!post) {
        // If there is a server error, you might want to
        // throw an error instead of returning so that the cache is not updated
        // until the next successful request.
        return {
            notFound: true
        }
    }
    // Pass post data to the page via props
    return {
        props: {post}
    }
}