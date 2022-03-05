import React from 'react';
import Image from "next/image";
import {getPostCardImg} from "../../shared/images/postCardImg";
import {capitalize} from "../../shared/utils/string.utils";
import {timeSince} from "../../shared/utils/date.utils";
import CategoryInput from "../CategoryInput";
import LikePostButton from "./like/LikePostButton";
import {className} from "../../shared/utils/class.utils";
import {IPost} from "../../shared/types/post.type";

const SinglePost = ({post}: { post: IPost }) => {
    return (
        <div
            className={"mx-8 md:mx-24 pb-2 mb-10 lg:mx-32 xl:mx-60 bg-transparent mt-5 rounded-2xl shadow-2xl"}>
            <div
                className={"shadow-xl mx-auto w-[256px] h-[140px] md:w-[576px] md:h-[315px]" +
                    " lg:h-96 lg:w-[700px] relative rounded-2xl overflow-hidden"}>
                <Image src={getPostCardImg(post)} layout={"fill"}
                       objectFit={"contain"} priority={true} alt={post.title} />
            </div>
            <div className={"px-4 pt-8"}>
                <h1 className={"text-2xl text-justify md:font-semibold"}>{post.title}</h1>
                <div className={"flex justify-between"}>
                    <div className={"flex"}>
                        <p className={"text-secondary-600"}>Source :&nbsp;</p>
                        <a href={post.sourceLink} target={"_blank"} className={"text-primary-400 underline"}
                           rel={"noopener noreferrer"}>{capitalize(post.sourceName)}</a>
                    </div>
                    <div>
                        <p className={"text-secondary-600"}>{timeSince(post.createdAt)}</p>
                    </div>
                </div>
                <div className={"flex justify-between pt-2"}>
                    {post.categories.map((cat, i) => {
                        if (i < 3) return <CategoryInput key={i} category={cat} />
                    })}
                </div>
                <LikePostButton post={post} />
                {post.desc.split(/(?:\r\n|\r|\n)/g).map((s, i) => {
                    return <p
                        className={className("text-justify text-lg", i === 0 ? 'pt-3 first-letter:pl-5 first-letter:font-extrabold' : '')}
                        key={i}>{s} <br /></p>
                })}
            </div>
        </div>
    );
};

export default SinglePost;