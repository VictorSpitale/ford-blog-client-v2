import React from 'react';
import SEO from "../components/shared/seo";
import LoginForm from "../components/login/LoginForm";
import {useRouter} from "next/router";
import {useAppContext} from "../context/AppContext";

const Login = () => {

    const router = useRouter();
    const uuid = useAppContext();
    if (uuid) {
        router.push('/account');
    }

    return (
        <>
            <SEO title={"Connexion"} shouldIndex={false} />
            <LoginForm />
        </>
    );
};

export default Login;