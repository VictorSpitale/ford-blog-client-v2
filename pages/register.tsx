import React from 'react';
import SEO from "../components/shared/seo";
import RegisterForm from "../components/login/RegisterForm";
import {useRouter} from "next/router";
import {useAppContext} from "../context/AppContext";
import {useTranslation} from "../shared/hooks/useTranslation";

const Register = () => {

    const router = useRouter();
    const uuid = useAppContext();
    const t = useTranslation()
    if (uuid) {
        router.push('/account');
    }

    return (
        <>
            <SEO title={t.register.title} shouldIndex={false} />
            <RegisterForm />
        </>
    );
};

export default Register;