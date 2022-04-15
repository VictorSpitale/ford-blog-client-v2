import React from 'react';
import SEO from "../components/shared/seo";
import LoginForm from "../components/login/LoginForm";
import {useRouter} from "next/router";
import {useAppContext} from "../context/AppContext";
import {useTranslation} from "../shared/hooks/useTranslation";

const Login = () => {

    const router = useRouter();
    const uuid = useAppContext();
    const t = useTranslation();
    if (uuid) {
        router.push('/account');
    }

    return (
        <>
            <SEO title={t.login.title} shouldIndex={false} />
            <LoginForm />
        </>
    );
};


export default Login;