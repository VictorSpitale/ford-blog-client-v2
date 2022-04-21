import React, {FormEvent, useEffect, useState} from 'react';
import {wrapper} from "../../context/store";
import {useRouter} from "next/router";
import styles from '../../styles/Login.module.css'
import InputField from "../../components/shared/InputField";
import {className} from "../../shared/utils/class.utils";
import {useFetch, useTranslation} from "../../shared/hooks";
import SEO from "../../components/shared/seo";
import {IMethods} from "../../shared/types/methods.type";
import {isUuid} from "../../shared/utils/regex.utils";

const Token = ({token}: { token: string }) => {

    const router = useRouter();

    const t = useTranslation();
    useEffect(() => {
        if (!isUuid(token)) {
            router.push('/');
        }
    }, [])

    const {load, loading} = useFetch(`/users/password/${token}`, IMethods.POST, () => router.push('/login'));
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password.trim().length < 6) return;
        await load({password})
    }

    return (
        <>
            <SEO title={t.login.recovery.title} shouldIndex={false} />
            <div className={styles.recovery}>
                <div
                    className={className("w-72 md:w-[450px] overflow-hidden rounded-2xl bg-neutral-50 px-8 py-4",
                        styles.recovery_content)}>
                    <h1 className={"text-2xl text-center"}>{t.login.recovery.title}</h1>
                    <p className={"text-center"}>{t.login.recovery.desc}</p>
                    <form onSubmit={handleSubmit}>
                        <InputField name={"password"} type={"password"} label={t.login.password}
                                    autoComplete={"new-password"} onChange={
                            (e) => setPassword(e.target.value)} />
                        <button type={"submit"}
                                className={"rounded bg-primary-400 px-3 text-white py-1 mt-3"}>
                            {loading ? t.common.loading : t.common.save}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Token;

Token.getInitialProps = wrapper.getInitialPageProps(
    () => (context) => {
        return {
            token: context.query.token
        }
    }
);

