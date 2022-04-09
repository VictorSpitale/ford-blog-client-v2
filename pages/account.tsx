import React, {useEffect} from 'react';
import {useAppContext} from "../context/AppContext";
import Login from "./login";
import {useRouter} from "next/router";
import {instance} from "../context/instance";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const Account = () => {

    const router = useRouter();

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


    const uuid = useAppContext();

    if (!uuid) {
        return <Login />
    }

    return (
        <div>
            Mon Compte
        </div>
    );
};


export const getStaticProps = async ({locale}: { locale: string }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'httpErrors', 'auth']),
    },
})

export default Account;