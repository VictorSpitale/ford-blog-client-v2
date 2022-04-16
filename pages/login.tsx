import React from 'react';
import SEO from "../components/shared/seo";
import LoginForm from "../components/login/LoginForm";
import {useRouter} from "next/router";
import {useTranslation} from "../shared/hooks/useTranslation";
import {useAppSelector} from "../context/hooks";
import {isEmpty} from "../shared/utils/object.utils";

const Login = () => {

    const router = useRouter();
    const {user} = useAppSelector(state => state.user)
    const t = useTranslation();
    if (!isEmpty(user)) {
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