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

const Account: NextPageWithLayout = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const t = useTranslation();

    const {view} = useAppSelector(state => state.accountView)
    const {posts, pending: pendingLikedPosts} = useAppSelector(state => state.likedPosts);
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
            if (typeof token === "string") {
                fetch(token);
            }
        }
    }, [router])

    const fetchPosts = useCallback(async () => {
        await dispatch(getLikedPost(user._id));
    }, [dispatch, user._id]);

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


    if (isEmpty(user)) {
        return <Login />
    }

    return (
        <>
            <SEO title={t.account.title} shouldIndex={false} />
            <AccountView view={view} authUser={{user, pending: pendingUser}}
                         likes={{likedPosts: posts, pending: pendingLikedPosts}} />
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