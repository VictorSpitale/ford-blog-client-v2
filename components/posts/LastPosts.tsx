import React, {memo} from 'react';
import {IPost} from "../../shared/types/post.type";
import PostCard from "./PostCard";

const LastPosts = ({posts}: { posts: IPost[] }) => {
    return (
        <>
            {posts.map((post, i) => {
                return <PostCard key={i} post={post} />
            })}
        </>
    );
};

export default memo(LastPosts);