import React, {ForwardedRef, forwardRef, memo} from 'react';
import {IPost} from "../../shared/types/post.type";
import Link from "next/link";
import {capitalize} from "../../shared/utils/string.utils";
import {getTimeSinceMsg, timeSince} from "../../shared/utils/date.utils";
import CategoryInput from "../categories/CategoryInput";
import Image from "next/image";
import {blurImg} from "../../shared/images/blurImg";
import {getPostCardImg} from "../../shared/images/postCardImg";
import {useTranslation} from "../../shared/hooks";
import {className} from "../../shared/utils/class.utils";
import Button from "../shared/Button";

type PropsType = {
    post: IPost;
    large?: boolean
}

const PostCard = forwardRef(({
                                 post,
                                 large = false
                             }: PropsType, ref: ForwardedRef<HTMLDivElement>) => {

    const t = useTranslation();
    const timeSinceObj = timeSince(post.createdAt)

    return (
        <div ref={ref} data-content={"post-card"}
             className={className(large ? "w-[300px] md:w-[600px]" : "w-60 md:w-80", "bg-gray-50 shadow-xl rounded-lg mb-6 overflow-hidden")}>
            {post.picture ? <Link href={`/post/${post.slug}`}>
                <a className={"w-full block"}><Image src={getPostCardImg(post)} alt={post.title}
                                                     width={large ? "700" : "500"}
                                                     height={large ? "300" : "250"}
                                                     objectFit={"cover"} placeholder={"blur"}
                                                     blurDataURL={blurImg} /></a>
            </Link> : <div data-content={"picture-replacement"}
                           className={className("block", large ? "" : "w-[320px] h-[160px]")} />}
            <div className={"py-2 flex flex-col justify-between h-[198px]"}>
                <div className={"px-4 flex flex-wrap flex-col"}>
                    <div data-content={"categories"} className={"flex justify-between w-full py-1"}>
                        {post.categories.map((cat, i) => {
                            if (i < 2) return <CategoryInput key={i} category={cat} />
                            if (i === post.categories.length - 1 && i >= 2) return <CategoryInput key={i}
                                                                                                  more={post.categories.length - 2} />
                        })}
                    </div>
                    <h3 className={"text-sm md:text-lg font-bold truncate tracking-wide w-full"}>{post.title}</h3>
                    <p data-content={"desc"} className={"break-words text-justify text-sm line-clamp-3"}>{post.desc}</p>
                </div>
                <div className={"px-4 flex items-center justify-between pt-3"}>
                    <div className={"w-1/2"}>
                        <Link href={post.sourceLink}>
                            <a className={"line-clamp-1"} target={"_blank"}
                               rel="noopener noreferrer">{capitalize(post.sourceName)}</a>
                        </Link>
                        <p>{getTimeSinceMsg(t, timeSinceObj)}</p>
                    </div>
                    <Button text={t.posts.readMore} element={"link"} onClick={`/post/${post.slug}`}
                            classes={"px-2 py-1 md:px-4 md:py-2 text-sm"} />
                </div>
            </div>
        </div>
    );
});

PostCard.displayName = "PostCard";
export default memo(PostCard);