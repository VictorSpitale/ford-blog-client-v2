import React, {memo, useRef, useState} from 'react';
import {IPost, UpdatePost} from "../../../shared/types/post.type";
import {AnyFunction} from "../../../shared/types/props.type";
import Modal from "../../modal/Modal";
import InputField from "../../shared/InputField";
import Image from "next/image"
import {getPostCardImg} from "../../../shared/images/postCardImg";
import TextAreaField from "../../shared/TextAreaField";
import {useAppDispatch} from "../../../context/hooks";
import {isEmpty} from "../../../shared/utils/object.utils";
import {isValidUrl} from "../../../shared/utils/regex.utils";
import {updatePost} from "../../../context/actions/posts.actions";
import {useTranslation} from "../../../shared/hooks";
import CategoriesSelector from "../../categories/CategoriesSelector";
import {toUpdatePost} from "../../../shared/utils/post/post.utils";
import {ICategory} from "../../../shared/types/category.type";

type PropsType = {
    post: IPost;
    toggle: AnyFunction;
    isShowing: boolean;
    categories: ICategory[];
    updatedCategories: ICategory[];
    pending: boolean;
    categoriesPending: boolean;
}

const UpdatePostModal = ({
                             post,
                             toggle,
                             isShowing,
                             updatedCategories,
                             pending,
                             categoriesPending,
                             categories
                         }: PropsType) => {

    const t = useTranslation();

    const [postState, setPostState] = useState<UpdatePost>(toUpdatePost(post));
    const [error, setError] = useState('');

    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch();

    const handleUpdate = async () => {
        setError('');
        let k: keyof UpdatePost
        for (k in postState) {
            if (k !== "categories" && postState[k].trim() === "") {
                return abortUpdate(t.posts.update.errors.fields)
            }
        }
        if (isEmpty(updatedCategories)) return abortUpdate(t.posts.update.errors.categories)
        if (!isValidUrl(postState.sourceLink)) return abortUpdate(t.posts.update.errors.link)
        const categories: string[] = [];
        updatedCategories.forEach((cat) => categories.push(cat._id))
        await dispatch(updatePost({...postState, slug: post.slug, categories})).then((res) => {
            if (res.meta.requestStatus === "rejected") return abortUpdate(t.posts.update.errors.failed);
            toggle();
        })
    }

    const abortUpdate = (msg: string) => {
        ref.current?.scrollTo({top: 0, behavior: "smooth"})
        setError(msg);
    }

    return (
        <Modal ref={ref} hide={toggle} isShowing={isShowing} large={true} title={t.posts.update.title}>
            <div className={"p-4"}>
                <div className={"flex justify-center"}>
                    <Image src={getPostCardImg(post)} width={"400"} height={"200"} objectFit={"cover"}
                           alt={post.title} />
                </div>
                {error &&
					<p className={"mt-2 bg-red-400 text-white rounded text-center mx-auto w-fit px-4"}>
                        {error}
					</p>
                }
                <div className={"separate_child"}>
                    <InputField name={"title"} value={postState.title} label={t.posts.update.fields.title}
                                onChange={(e) => setPostState({
                                    ...postState,
                                    title: e.target.value
                                })} />
                    <p className={"w-full text-gray-500"}>{t.posts.update.fields.categories}</p>
                    <CategoriesSelector categories={categories} pending={categoriesPending}
                                        defaultCategories={post.categories} selectedCategories={updatedCategories} />
                    <InputField name={"sourceName"} value={postState.sourceName} label={t.posts.update.fields.source}
                                onChange={(e) => setPostState({
                                    ...postState,
                                    sourceName: e.target.value
                                })} />
                    <InputField name={"sourceLink"} value={postState.sourceLink}
                                label={t.posts.update.fields.sourceLink}
                                onChange={(e) => setPostState({
                                    ...postState,
                                    sourceLink: e.target.value
                                })} />
                    <TextAreaField name={"desc"} label={t.posts.update.fields.desc} value={postState.desc}
                                   onChange={(e) => setPostState({
                                       ...postState,
                                       desc: e.target.value
                                   })} />
                    <div className={"flex justify-around my-5"}>
                        <button
                            className={"md:px-8 hover:bg-green-600 rounded bg-green-500 text-white py-2 px-4 shadow drop-shadow"}
                            onClick={handleUpdate}>{pending ? t.common.loading : t.posts.update.fields.confirm}</button>
                        <button className={"md:px-8 hover:bg-gray-400 rounded bg-gray-300 py-2 px-4 shadow drop-shadow"}
                                onClick={toggle}>{t.common.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default memo(UpdatePostModal);