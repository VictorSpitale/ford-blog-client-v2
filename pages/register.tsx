import React from 'react';
import SEO from "../components/shared/seo";
import RegisterForm from "../components/login/RegisterForm";
import {useRouter} from "next/router";
import {useAppContext} from "../context/AppContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

const Register = () => {

    const router = useRouter();
    const uuid = useAppContext();
    const {t} = useTranslation('auth')
    if (uuid) {
        router.push('/account');
    }

    return (
        <>
            <SEO title={t('register.title')} shouldIndex={false} />
            <RegisterForm />
        </>
    );
};

export const getStaticProps = async ({locale}: { locale: string }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'httpErrors', 'auth']),
    },
})

export default Register;