import React from 'react';
import SEO from "../components/shared/seo";
import LoginForm from "../components/login/LoginForm";
import {useRouter} from "next/router";
import {useAppContext} from "../context/AppContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

const Login = () => {

    const router = useRouter();
    const uuid = useAppContext();
    const {t} = useTranslation('auth')
    if (uuid) {
        router.push('/account');
    }

    return (
        <>
            <SEO title={t('login.title')} shouldIndex={false} />
            <LoginForm />
        </>
    );
};

export const getStaticProps = async ({locale}: { locale: string }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'httpErrors', 'auth']),
    },
})


export default Login;