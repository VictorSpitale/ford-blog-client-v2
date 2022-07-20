import React, {useCallback, useEffect, useState} from 'react';
import {AnyFunction} from "../../../shared/types/props.type";
import {ICategory} from "../../../shared/types/category.type";
import Tabs from "../../tabs/Tabs";
import {useTranslation} from "../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import {getCategorizedPosts} from "../../../context/actions/posts/posts.actions";
import RenderIf from "../../shared/RenderIf";
import {IPost} from "../../../shared/types/post.type";
import {isEmpty} from "../../../shared/utils/object.utils";
import {className} from "../../../shared/utils/class.utils";
import Image from "next/image";
import {getPostCardImg} from "../../../shared/images/postCardImg";
import PostDetailsModalContent from "./PostDetailsModalContent";

type PropsType = {
    setOtherModal: AnyFunction;
    category: ICategory;
}

const CategoryDetailsModalContent = ({category, setOtherModal}: PropsType) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const {posts: categorizedPosts, pending} = useAppSelector(state => state.categorizedPosts);

    const [posts, setPosts] = useState<IPost[]>([]);

    const navigateToPost = (post: IPost) => {
        setOtherModal(
            <PostDetailsModalContent setOtherModal={setOtherModal} post={post} />
        )
    }

    const fetchCategorized = useCallback(async () => {
        await dispatch(getCategorizedPosts(category.name));
    }, []);

    useEffect(() => {
        const found = categorizedPosts.find((c) => c.category === category.name);
        if (found) setPosts(found.posts);
    }, [categorizedPosts]);

    useEffect(() => {
        fetchCategorized()
    }, []);

    return (
        <div className={"px-4 py-2"} data-large={"false"}>
            <Tabs>
                <div data-label={t.admin.categories.tabs.informations}
                     className={className("[&>*]:flex [&>*]:justify-between [&>*]:gap-x-3 [&>*]:mb-4",
                         "[&>*>p:first-child]:font-semibold [&>*>p:last-child]:text-right")}>
                    <div>
                        <p>ID</p>
                        <p>{category._id}</p>
                    </div>
                    <div>
                        <p>{t.admin.categories.fields.name}</p>
                        <p>{category.name}</p>
                    </div>
                </div>
                <div data-label={t.admin.categories.tabs.relatedPosts}>
                    <RenderIf condition={pending}>
                        <p className={"italic"}>{t.common.loading}</p>
                    </RenderIf>
                    <RenderIf condition={isEmpty(posts)}>
                        <p className={"italic"}>{t.common.noPost}</p>
                    </RenderIf>
                    <RenderIf condition={!isEmpty(posts)}>
                        {posts.map((post, i) => {
                            return (
                                <div key={i}>
                                    <div className={"flex items-center gap-x-4"}>
                                        <div
                                            className={"relative min-w-[50px] h-[50px] rounded-lg  overflow-hidden"}>
                                            <Image src={getPostCardImg(post)} layout={"fill"}
                                                   objectFit={"cover"}
                                                   alt={post.title} />
                                        </div>
                                        <p onClick={() => navigateToPost(post)}
                                           className={"text-right text-blue-400 underline cursor-pointer"}>{post.title}</p>
                                    </div>
                                    <RenderIf condition={i !== posts.length - 1}>
                                        <hr className={"mt-4"} />
                                    </RenderIf>
                                </div>
                            )
                        })}
                    </RenderIf>
                </div>
            </Tabs>
        </div>
    );
};

export default CategoryDetailsModalContent;