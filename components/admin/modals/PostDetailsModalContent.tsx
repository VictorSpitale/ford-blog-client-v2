import React from 'react';
import {AnyFunction} from "../../../shared/types/props.type";
import {IPost} from "../../../shared/types/post.type";
import Image from "next/image";
import {getPostCardImg} from "../../../shared/images/postCardImg";
import RenderIf from "../../shared/RenderIf";
import {blurImg} from "../../../shared/images/blurImg";
import {className} from "../../../shared/utils/class.utils";
import Tabs from "../../tabs/Tabs";
import Link from "next/link";
import {formateDate} from "../../../shared/utils/date.utils";

type PropsType = {
    setOtherModal: AnyFunction;
    post: IPost
}

const PostDetailsModalContent = ({post, setOtherModal}: PropsType) => {
    return (
        <div className={"px-4 py-2"}>
            <div className={"flex gap-x-4"}>
                <div className={"w-1/2"}>
                    <div>
                        <RenderIf condition={!!post.picture}>
                            <div className={"overflow-hidden rounded-2xl w-full h-[300px] relative"}>
                                <Image alt={post.title} src={getPostCardImg(post)} layout={"fill"} objectFit={"cover"}
                                       placeholder={"blur"} blurDataURL={blurImg} />
                            </div>
                        </RenderIf>
                        <h1 className={"mt-5 text-center text-lg md:text-2xl text-justify md:font-semibold"}>{post.title}</h1>
                    </div>
                </div>
                <div className={"w-1/2"}>
                    <Tabs>
                        <div data-label={'Informations'}
                             className={className("[&>*]:flex [&>*]:justify-between [&>*]:gap-x-3 [&>*]:mb-4",
                                 "[&>*>p:first-child]:font-semibold [&>*>p:last-child]:text-right")}>
                            <div>
                                <p>ID</p>
                                <p>{post._id}</p>
                            </div>
                            <div>
                                <p>Slug</p>
                                <Link href={`/post/${post.slug}`} passHref={true}>
                                    <p className={"underline text-blue-400"}>{post.slug}</p>
                                </Link>
                            </div>
                            <div>
                                <p>Source</p>
                                <a href={post.sourceLink}>
                                    <p className={"underline text-blue-400"}>{post.sourceName}</p>
                                </a>
                            </div>
                            <div>
                                <p>Catégories</p>
                                <p>
                                    {post.categories.map((cat, i) => {
                                        return (
                                            <span key={i}
                                                  className={"underline text-blue-400 cursor-pointer"}>
                                                {cat.name}{i !== post.categories.length - 1 ? ", " : ""}
                                            </span>
                                        )
                                    })}
                                </p>
                            </div>
                            <div>
                                <p>Nombre de j'aimes</p>
                                <p>{post.likes}</p>
                            </div>
                            <div>
                                <p>Nombre de commentaires</p>
                                <p>{post.comments.length}</p>
                            </div>
                            <div>
                                <p>Publié le</p>
                                <p>{formateDate(post.createdAt)}</p>
                            </div>
                            <div>
                                <p>Modifié le</p>
                                <p>{formateDate(post.updatedAt)}</p>
                            </div>
                        </div>
                        <div data-label={"J'aimes"}>
                            <div className={"flex justify-between"}>

                            </div>
                        </div>
                        <div data-label={"Commentaires"}>
                            <div className={"flex justify-between"}>

                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <div className={"max-h-[100px] overflow-auto c-scroll mt-5"}>
                {post.desc.split(/\r\n|\r|\n/g).map((s, i) => {
                    return <p
                        className={className("text-justify text-lg", i === 0 ? 'pt-3 first-letter:pl-5 first-letter:font-extrabold' : '')}
                        key={i}>{s} <br /></p>
                })}
            </div>
        </div>
    );
};

export default PostDetailsModalContent;