import React from 'react';
import SEO from "../components/shared/seo";
import RegisterForm from "../components/login/RegisterForm";
import {useRouter} from "next/router";
import {useAppContext} from "../context/AppContext";

const Register = () => {

    const router = useRouter();
    const uuid = useAppContext();
    if (uuid) {
        router.push('/account');
    }

    return (
        <>
            <SEO title={"Inscription"} shouldIndex={false} />
            <RegisterForm />
        </>
    );
};

export default Register;