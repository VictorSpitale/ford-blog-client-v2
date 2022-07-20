import React, {ReactElement, useEffect} from 'react';
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
import {cleanLikedPosts} from "../../context/actions/posts/posts.actions";
import Layout from "../../components/layouts/Layout";
import {NextPageWithLayout} from "../../shared/types/page.type";
import {setError} from "../../context/actions/errors.actions";

const Account: NextPageWithLayout = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const t = useTranslation();

    const {view} = useAppSelector(state => state.accountView)
    const {user, pending: pendingUser} = useAppSelector(state => state.user);

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
            /* istanbul ignore else */
            if (typeof token === "string") {
                fetch(token);
            }
        }
    }, [router])

    useEffect(() => {
        const resetState = () => {
            dispatch(setView(AccountViews.PROFILE));
            dispatch(cleanLikedPosts(user._id));
        }

        return () => {
            resetState();
        }
    }, [dispatch])

    useEffect(() => {
        dispatch(setError({error: "", key: "profileViewError"}));
        dispatch(setError({error: "", key: "securityViewError"}));
    }, [dispatch, view]);

    if (isEmpty(user)) {
        return <Login />
    }

    return (
        <>
            <SEO title={t.account.title} shouldIndex={false} />
            <AccountView view={view} authUser={{user, pending: pendingUser}} />
        </>
    );
};

export default Account;

/* istanbul ignore next */
Account.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}