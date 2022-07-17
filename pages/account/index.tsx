import React, {ReactElement, RefObject, useEffect} from 'react';
import Login from "../login";
import {useRouter} from "next/router";
import {fetchApi} from "../../context/instance";
import SEO from "../../components/shared/seo";
import AccountView from "../../components/account/AccountView";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {setView} from "../../context/actions/account.actions";
import {AccountViews} from "../../shared/types/accountViews.type";
import {isEmpty} from "../../shared/utils/object.utils";
import {useTranslation} from "../../shared/hooks";
import {cleanLikedPosts} from "../../context/actions/posts.actions";
import Layout from "../../components/layouts/Layout";
import {NextPageWithLayout} from "../../shared/types/page.type";
import {deleteAccount, logout, updateLoggedUser} from "../../context/actions/user.actions";
import {HttpError} from "../../shared/types/httpError.type";
import {setError} from "../../context/actions/errors.actions";
import {AnyFunction} from "../../shared/types/props.type";

const Account: NextPageWithLayout = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const t = useTranslation();

    const {view} = useAppSelector(state => state.accountView)
    const {user, pending: pendingUser} = useAppSelector(state => state.user);
    const {securityViewError} = useAppSelector(state => state.errors);

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
        dispatch(setError({error: "", key: "securityViewError"}));
    }, [dispatch, view]);

    const handleChangePassword = async (setSuccess: AnyFunction, currentPasswordRef: RefObject<HTMLInputElement>, passwordRef: RefObject<HTMLInputElement>) => {
        if (!passwordRef.current || !currentPasswordRef.current) return;
        const password = passwordRef.current.value;
        const currentPassword = currentPasswordRef.current.value;
        dispatch(setError({error: "", key: "securityViewError"}))
        setSuccess('');
        if (password.trim() === "" || password.length < 6) {
            return dispatch(setError({error: t.account.security.errors.password, key: "securityViewError"}))
        }
        if (currentPassword.trim() === "" || currentPassword.length < 6) {
            return dispatch(setError({error: t.account.security.errors.currentPassword, key: "securityViewError"}))
        }
        await dispatch(updateLoggedUser({password, _id: user._id, currentPassword})).then((res) => {
            if (!passwordRef.current || !currentPasswordRef.current) return;
            if (res.meta.requestStatus === "rejected") {
                const payload = res.payload as HttpError;
                if (payload.code && payload.code === 17) {
                    return dispatch(setError({error: t.httpErrors["17"], key: "securityViewError"}))
                }
                return dispatch(setError({error: t.account.security.errors.rejectedPassword, key: "securityViewError"}))
            }
            passwordRef.current.value = '';
            currentPasswordRef.current.value = '';
            setSuccess(t.account.security.success)
        })
    }

    const handleDeleteAccount = async () => {
        dispatch(setError({error: "", key: "securityViewError"}))
        await dispatch(deleteAccount(user._id)).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return dispatch(setError({error: t.account.security.errors.deleteAccount, key: "securityViewError"}))
            }
        })
    }

    const handleLogout = async () => {
        await dispatch(logout())
    }

    if (isEmpty(user)) {
        return <Login />
    }

    return (
        <>
            <SEO title={t.account.title} shouldIndex={false} />
            <AccountView view={view} authUser={{user, pending: pendingUser}}
                         security={{
                             error: securityViewError,
                             changePassword: handleChangePassword,
                             deleteAccount: handleDeleteAccount
                         }}
                         handleLogout={handleLogout}
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