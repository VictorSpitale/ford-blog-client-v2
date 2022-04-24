import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import Layout from "../../components/layouts/Layout";
import {isEmpty} from "../../shared/utils/object.utils";
import {IUserRole} from "../../shared/types/user.type";
import {NextPage} from "next";
import BaseView from "../../components/shared/BaseView";
import Link from 'next/link'
import InputField from "../../components/shared/InputField";
import {getCreatePostKeys, ICreatePost} from "../../shared/types/post.type";
import {slugify} from "../../shared/utils/string.utils";
import SelectCategories from "../../components/categories/SelectCategories";
import TextAreaField from "../../components/shared/TextAreaField";
import {isValidUrl} from "../../shared/utils/regex.utils";
import {createPost} from "../../context/actions/posts.actions";
import Image from 'next/image'
import SEO from "../../components/shared/seo";
import {useTranslation} from "../../shared/hooks";
import {HttpError} from "../../shared/types/httpError.type";
import {useRouter} from "next/router";

const Write = () => {

    const {user} = useAppSelector(state => state.user);
    const {categories} = useAppSelector(state => state.selectCategories);
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const [post, setPost] = useState<ICreatePost>({} as ICreatePost);
    const [file, setFile] = useState({} as { src?: string, file?: File });
    const t = useTranslation();
    const router = useRouter();

    const canAccess = () => {
        return (!isEmpty(user) && user.role >= IUserRole.POSTER);
    }

    const handleSubmit = async () => {
        setError('');
        getCreatePostKeys().forEach(key => {
            if (isEmpty(post[key])) return setError(`Le champs ${key} ne doit pas être vide`);
        })
        if (isEmpty(categories)) return setError('Veuillez sélectionner au moins une catégories');
        if (!isValidUrl(post.sourceLink)) return setError("Le lien de la source n'est pas un lien valide");
        if (!file.file) return setError("Veuillez ajouter une photo");
        const postCategories: string[] = [];
        categories.forEach((cat) => postCategories.push(cat._id));
        await dispatch(createPost({
            ...post,
            categories: postCategories,
            file: file.file
        })).then(res => {
            if (res.meta.requestStatus === "rejected") {
                const payload = res.payload as HttpError
                if (payload.code) return setError(t.httpErrors[payload.code as never]);
                return setError("Une erreur est survenue");
            }
            router.push(`/post/${post.slug}`);
        });
    }

    if (!canAccess()) {
        return (
            <>
                <SEO title={""} shouldIndex={false} />
                <div className={"w-3/4 m-auto pt-11"}>
                    <BaseView>
                        <h1 className={"text-lg md:text-2xl text-center"}>Vous n'avez pas accès à la publication
                            d'article</h1>
                        <Link href={"/"} passHref>
                            <a className={"underline mx-auto block text-center"}>Retourner à l'accueil</a>
                        </Link>
                    </BaseView>
                </div>
            </>
        )
    }

    return (
        <>
            <SEO title={"Publier un article"} shouldIndex={false} />
            <div className={"w-3/4 m-auto pt-11 mb-10"}>
                <BaseView className={"max-h-fit"}>
                    <h1 className={"text-2xl text-center"}>Publier un article</h1>
                    <hr className={"my-2"} />
                    {error && <p className={"bg-red-400 rounded text-white px-2 my-2"}>{error}</p>}
                    {file.src && <div className={"flex justify-center rounded-2xl overflow-hidden w-fit mx-auto"}>
						<Image src={file.src} alt="" width={"600"} height={"300"} objectFit={"cover"} />
					</div>}
                    <div className={"flex gap-x-5 flex-col md:flex-row"}>
                        <InputField name={"title"} label={"Titre"} onChange={(e) => {
                            setPost({
                                ...post,
                                title: e.target.value,
                                slug: slugify(e.target.value)
                            })
                        }} />
                        <slot className={"hidden md:block w-full"}>
                            <InputField name={"slug"} label={"Slug"} disabled value={post.slug} />
                        </slot>
                    </div>
                    <div className={"flex gap-x-5 flex-col md:flex-row my-0 md:my-3"}>
                        <InputField name={"sourceName"} label={"Nom de la source"} onChange={(e) => {
                            setPost({
                                ...post,
                                sourceName: e.target.value
                            })
                        }} />
                        <InputField name={"sourceLink"} label={"Lien de la source"} onChange={(e) => {
                            setPost({
                                ...post,
                                sourceLink: e.target.value
                            })
                        }} />
                    </div>
                    <hr className={"my-2"} />
                    <SelectCategories />
                    <hr className={"my-2"} />
                    <TextAreaField name={"desc"} label={"Description"} onChange={(e) => {
                        setPost({
                            ...post,
                            desc: e.target.value
                        })
                    }} />
                    <div className={"flex items-center justify-center mt-2 gap-x-3"}>
                        <label
                            className={"w-fit h-full block cursor-pointer leading-[200%] text-center border-0 rounded border py-1 px-4 text-white bg-primary-400 shadow-2xl"}>
                            Ajouter une photo
                            <input type={"file"} id={"inputFile"} style={{display: "none"}}
                                   accept={'.jpeg, .png, .jpg'} onChange={(e) => setFile({
                                file: (e.target.files && e.target.files.length > 0) ? e.target.files[0] : undefined,
                                src: (e.target.files && e.target.files.length > 0) ? window.URL.createObjectURL(e.target.files[0]) : undefined
                            })} />
                        </label>
                        <button
                            className={"md:px-8 hover:bg-green-600 rounded bg-green-500 text-white py-2 px-4 shadow drop-shadow"}
                            onClick={handleSubmit}>Publier
                        </button>
                    </div>
                </BaseView>
            </div>
        </>
    );
};

export default Write;

Write.getLayout = function (page: NextPage) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}