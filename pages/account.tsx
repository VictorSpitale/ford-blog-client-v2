import React, {useEffect} from 'react';
import Login from "./login";
import {useRouter} from "next/router";
import {instance} from "../context/instance";
import SEO from "../components/shared/seo";
import AccountView from "../components/account/AccountView";
import {useAppDispatch, useAppSelector} from "../context/hooks";
import {setView} from "../context/actions/account.actions";
import {AccountViews} from "../shared/types/accountViews.type";
import {isEmpty} from "../shared/utils/object.utils";

const Account = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetch = async (token: string) => {
            await instance.get(`/auth/g-jwt/${token}`).then(() => {
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
        const resetView = async () => {
            await dispatch(setView(AccountViews.PROFILE));
        }
        return () => {
            resetView();
        }
    }, [])


    const {user} = useAppSelector(state => state.user)

    if (isEmpty(user)) {
        return <Login />
    }

    return (
        <>
            <SEO title={"Mon compte"} shouldIndex={false} />
            <AccountView />
        </>
    );
};

export default Account;