import React, {FormEvent, useState} from 'react';
import styles from '../../styles/Register.module.css'
import Image from "next/image"
import registerImg from '../../public/static/img/cropped-1440-900-461994 (1).jpg'
import {className} from "../../shared/utils/class.utils";
import fu from "../../public/static/img/FORD_UNIVERSE.svg";
import InputField from "../shared/InputField";
import Delimiter from "../shared/Delimiter";
import SignWithGoogle, {SignStatus} from "../shared/SignWithGoogle";
import Link from 'next/link'
import {validateEmail} from "../../shared/utils/regex.utils";
import {useFetch} from "../../shared/hooks/useFetch";
import {IMethods} from "../../shared/types/methods.type";
import {useRouter} from "next/router";
import {blurImg} from "../../shared/images/blurImg";
import {useTranslation} from "../../shared/hooks/useTranslation";

const RegisterForm = () => {

    const [email, setEmail] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslation();

    const canSubmit = (): boolean => {
        return (email !== "" && password !== "" && pseudo !== ""
            && confPassword !== "" && password.length >= 6 && confPassword.length >= 6
            && pseudo.length >= 6 && pseudo.length <= 18);
    }

    const handleRequest = () => {
        router.push("/login?register=success")
    }

    const {loading, load, error: fetchError, code} = useFetch("/users", IMethods.POST, handleRequest);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!canSubmit()) {
            setError(t.register.error.fields);
            return;
        }
        if (!validateEmail(email)) {
            setError(t.register.error.email);
            return;
        }
        if (password !== confPassword) {
            setError(t.register.error.password);
            return;
        }
        await load({email, pseudo, password});
    }

    return (
        <div className={className("bg-neutral-50 w-72 md:w-3/4 justify-center shadow-2xl", styles.register_container)}>
            <div className={"w-max md:w-1/2"}>
                <div className={styles.car_logo}>
                    <Image width={"159"} height={"53"} src={fu.src} alt="Ford Universe Logo" />
                </div>
                <h1 className={"text-lg text-center"}>{t.common.title.replace('{{title}}', t.common.siteName)}</h1>
                {(code || error || fetchError) &&
					<p className={"text-center text-red-500 text-sm"}>{code ? t.httpErrors[code] : error || fetchError}</p>}
                <form className={className("px-2 md:px-[30px]", styles.register_form)}
                      onSubmit={handleSubmit}>
                    <InputField name={"pseudo"} label={t.register.pseudo} required={true}
                                autoComplete={"username"}
                                onChange={(e => setPseudo(e.target.value))} />
                    <InputField name={"email"} label={t.register.email} required={true} autoComplete={"email"}
                                onChange={(e => setEmail(e.target.value))} />
                    <InputField name={"password"} label={t.register.password} required={true} type={"password"}
                                autoComplete={"new-password"} onChange={(e => setPassword(e.target.value))} />
                    <InputField name={"confirm-password"} label={t.register.confPassword} required={true}
                                type={"password"} autoComplete={"new-password"}
                                onChange={(e => setConfPassword(e.target.value))} />
                    <button type={"submit"} disabled={!canSubmit()}
                            className={className("mx-auto mt-5 bg-primary-400 hover:bg-primary-300 text-white rounded-2xl px-4 py-2",
                                !canSubmit() ? "hover:cursor-not-allowed bg-primary-300" : "")}>
                        {loading ? t.common.loading : t.register.register}
                    </button>
                    <Delimiter>{t.common.or}</Delimiter>
                    <div className={"m-auto"}>
                        <SignWithGoogle status={SignStatus.SIGN_UP} />
                    </div>
                </form>
                <div className={"mt-6 text-sm flex justify-center pb-5"}>
                    <p className={"text-center whitespace-nowrap"}>{t.register.already}&nbsp;
                        <Link href={"/login"}>
                            <a className={"underline"}>{t.register.signIn}</a>
                        </Link>
                    </p>
                </div>

            </div>
            <div className={className("hidden md:block bg-primary-100", styles.register_container_left)}>
                <div className={styles.form_img_container}>
                    <Image src={registerImg.src} className={styles.form_img} layout={"fill"} objectFit={"cover"}
                           alt={"register background image"} priority placeholder={"blur"}
                           blurDataURL={blurImg} />
                </div>
                <div className={styles.form_left_text_container}>
                    <h1 className={"text-xl text-center text-white"}>{t.common.fullSiteName}</h1>
                    <p className={"text-center mx-4 mt-3 lg:text-lg text-white"}>{t.common.desc}</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;