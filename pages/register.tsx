import React from 'react';
import SEO from "../components/shared/seo";
import RegisterForm from "../components/login/RegisterForm";
import {useRouter} from "next/router";
import {useTranslation} from "../shared/hooks";
import {useAppSelector} from "../context/hooks";
import {isEmpty} from "../shared/utils/object.utils";

const Register = () => {

    const router = useRouter();
    const {user} = useAppSelector(state => state.user)
    const t = useTranslation()
    if (!isEmpty(user)) {
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