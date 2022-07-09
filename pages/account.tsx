import React, {ReactElement, useCallback, useEffect} from 'react';
import Login from "./login";
import {useRouter} from "next/router";
import {fetchApi} from "../context/instance";
import SEO from "../components/shared/seo";
import AccountView from "../components/account/AccountView";
import {useAppDispatch, useAppSelector} from "../context/hooks";
import {setView} from "../context/actions/account.actions";
import {AccountViews} from "../shared/types/accountViews.type";
import {isEmpty} from "../shared/utils/object.utils";
import {useTranslation} from "../shared/hooks";
import {cleanLikedPosts, getLikedPost} from "../context/actions/posts.actions";
import Layout from "../components/layouts/Layout";
import {NextPageWithLayout} from "../shared/types/page.type";
import {removePicture, updateLoggedUser, uploadPicture} from "../context/actions/user.actions";
import {HttpError} from "../shared/types/httpError.type";
import {setError} from "../context/actions/errors.actions";
import {IUser, UpdateUser} from "../shared/types/user.type";

const Account: NextPageWithLayout = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const t = useTranslation();

    const {view} = useAppSelector(state => state.accountView)
    const {posts, pending: pendingLikedPosts} = useAppSelector(state => state.likedPosts);
    const {user, pending: pendingUser} = useAppSelector(state => state.user);
    const {profileViewError} = useAppSelector(state => state.errors);

    const fetchPosts = useCallback(async () => {
        await dispatch(getLikedPost(user._id));
    }, [dispatch, user._id]);


    useEffect(() => {
        const fetch = async (token: string) => {
            await fetchApi("/api/auth/g-jwt/{token}", {method: "get", params: {token}}).then(() => {
                location.href = "/account"
            }).catch(() => {
                location.href = "/login?status=failed"
            })
        }
        if (router.query.token) {
            const {token} = router.query;
            if (typeof token === "string") {
                fetch(token);
            }
        }
    }, [router])

    useEffect(() => {
        if (!isEmpty(user)) {
            fetchPosts();
        }
    }, [fetchPosts, user]);

    useEffect(() => {
        const resetState = async () => {
            await dispatch(setView(AccountViews.PROFILE));
            await dispatch(cleanLikedPosts());
        }

        return () => {
            resetState();
        }
    }, [dispatch])

    useEffect(() => {
        dispatch(setError({error: "", key: "profileViewError"}));
    }, [dispatch, view]);

    const handleSaveProfile = async (updatedUser: UpdateUser, authUser: IUser) => {
        dispatch(setError({error: "", key: "profileViewError"}));
        if (updatedUser.pseudo === authUser.pseudo) return;
        if (updatedUser.pseudo?.trim() === "" || (updatedUser.pseudo && (updatedUser.pseudo?.length < 6 || updatedUser.pseudo?.length > 18))) {
            return dispatch(setError({error: t.account.profile.errors.pseudo, key: "profileViewError"}));
        }
        await dispatch(updateLoggedUser({...updatedUser, _id: authUser._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                const payload = res.payload as HttpError;
                return dispatch(setError({
                    error: t.httpErrors[payload.code as never] || t.common.errorSub,
                    key: "profileViewError"
                }));
            }
        })
    }

    const handleProfilePictureUpload = async (files: FileList) => {
        dispatch(setError({error: "", key: "profileViewError"}));
        if (!files || !files[0]) return;
        const file = files[0];
        if (file.size > 100000) {
            return dispatch(setError({error: t.account.profile.errors.fileSize, key: "profileViewError"}));
        }
        const data = new FormData();
        data.append("file", file);
        await dispatch(uploadPicture({data, _id: user._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return dispatch(setError({error: t.account.profile.errors.fileError, key: "profileViewError"}));
            }
        })
    }

    const handleProfilePictureDeletion = async () => {
        dispatch(setError({error: "", key: "profileViewError"}));
        await dispatch(removePicture(user._id)).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return dispatch(setError({error: t.account.profile.errors.removeError, key: "profileViewError"}));
            }
        })
    }

    if (isEmpty(user)) {
        return <Login />
    }

    return (
        <>
            <SEO title={t.account.title} shouldIndex={false} />
            <AccountView view={view} authUser={{user, pending: pendingUser}}
                         likes={{likedPosts: posts, pending: pendingLikedPosts}}
                         profile={{
                             saveChanges: handleSaveProfile,
                             error: profileViewError,
                             uploadFile: handleProfilePictureUpload,
                             removeProfilePicture: handleProfilePictureDeletion
                         }}
            />
        </>
    );
};

export default Account;

Account.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}