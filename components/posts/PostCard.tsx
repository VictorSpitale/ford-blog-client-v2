import React from 'react';
import {IPost} from "../../shared/types/post.type";
import Link from "next/link";
import {capitalize} from "../../shared/utils/string.utils";
import {timeSince} from "../../shared/utils/date.utils";
import CategoryInput from "../CategoryInput";
import Image from "next/image";
import {blurImg} from "../../shared/images/blurImg";
import {getPostCardImg} from "../../shared/images/postCardImg";

const PostCard = ({post}: { post: IPost }) => {
    return (
        <div className={"bg-gray-50 shadow-xl rounded-lg mb-6 w-60 md:w-80 overflow-hidden"}>
            <Link href={`/post/${post.slug}`}>
                <a className={"w-full block"}><Image src={getPostCardImg(post)} alt={post.title} width={"500"}
                                                     height={"250"}
                                                     objectFit={"cover"} placeholder={"blur"}
                                                     blurDataURL={blurImg} /></a>
            </Link>
            <div className={"py-2"}>
                <div className={"px-4 flex flex-wrap"}>
                    <div className={"flex justify-between w-full py-1"}>
                        {post.categories.map((cat, i) => {
                            if (i < 2) return <CategoryInput key={i} category={cat} />
                            if (i === post.categories.length - 1 && i >= 2) return <CategoryInput key={i}
                                                                                                  more={post.categories.length - 2} />
                        })}
                    </div>
                    <h3 className={"text-sm md:text-lg font-bold truncate tracking-wide"}>{post.title}</h3>
                    <p className={"break-words text-justify text-sm line-clamp-3"}>{post.desc}</p>
                </div>
                <div className={"px-4 flex items-center justify-between pt-3"}>
                    <div>
                        <Link href={post.sourceLink}>
                            <a target={"_blank"} rel="noopener noreferrer">{capitalize(post.sourceName)}</a>
                        </Link>
                        <p>{timeSince(post.createdAt)}</p>
                    </div>
                    <Link href={`/post/${post.slug}`}>
                        <a className={"bg-primary-400 text-white px-2 py-1" +
                            " md:px-4 md:py-2 rounded-lg shadow-md shadow-primary-300/40" +
                            " hover:shadow-primary-300/60 text-sm hover:bg-primary-500"}>
                            Lire la suite</a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;