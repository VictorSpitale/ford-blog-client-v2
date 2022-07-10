import React, {FormEvent, useEffect, useState} from 'react';
import styles from '../../styles/Login.module.css'
import Image from "next/image"
import loginImg from '../../public/static/img/cropped-500-500-318084.jpg'
import {className} from "../../shared/utils/class.utils";
import fu from "../../public/static/img/FORD_UNIVERSE.svg";
import InputField from "../shared/InputField";
import Delimiter from "../shared/Delimiter";
import SignWithGoogle, {SignStatus} from "../shared/SignWithGoogle";
import Link from 'next/link'
import {validateEmail} from "../../shared/utils/regex.utils";
import {useRouter} from "next/router";
import {useFetch, useModal, useTranslation} from "../../shared/hooks";
import {IMethods} from "../../shared/types/methods.type";
import {blurImg} from "../../shared/images/blurImg";
import {IUser} from "../../shared/types/user.type";
import {useAppDispatch} from "../../context/hooks";
import {login} from "../../context/actions/user.actions";
import PasswordRecoveryModal from "./modals/PasswordRecoveryModal";

const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();
    const t = useTranslation();
    const dispatch = useAppDispatch();

    const handleRequest = async (data: IUser) => {
        await dispatch(login(data));
        await router.push("/account");
    }

    const {load, loading, error: fetchError, code} = useFetch('/auth/login', IMethods.POST, handleRequest);

    const canSubmit = (): boolean => {
        return (email !== "" && password !== "" && password.length >= 6);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!canSubmit()) {
            setError(t.login.error.fields);
            return;
        }
        if (!validateEmail(email)) {
            setError(t.login.error.email);
            return;
        }
        await load({email, password});
    }

    const {isShowing, toggle} = useModal();

    useEffect(() => {
        if (router.query.status && router.query.status === "failed") {
            setError(t.login.failed)
        } else if (router.query.register && router.query.register === "success") {
            setSuccessMessage(t.login.success)
        }
    }, [router, t.login.failed, t.login.success])

    return (<>
            <PasswordRecoveryModal isShowing={isShowing} toggle={toggle} />
            <div
                className={className("bg-neutral-50 w-72 md:w-3/4 justify-center shadow-2xl", styles.login_container)}>
                <div className={className("hidden md:block bg-primary-100", styles.login_container_left)}>
                    <div className={styles.form_img_container}>
                        <Image src={loginImg.src} className={styles.form_img} layout={"fill"} objectFit={"cover"}
                               alt={"Login background image"} priority placeholder={"blur"}
                               blurDataURL={blurImg} />
                    </div>
                    <div className={styles.form_left_text_container}>
                        <h1 className={"text-xl text-center"}>{t.common.fullSiteName}</h1>
                        <p className={"text-center mx-4 mt-3 lg:text-lg"}>{t.common.desc}</p>
                    </div>
                </div>
                <div className={"w-max md:w-1/2"}>
                    <div className={styles.car_logo}>
                        <Image width={"159"} height={"53"} src={fu.src} alt="Ford Universe Logo" />
                    </div>
                    <h1 className={"text-lg text-center"}>{t.common.title.replace('{{title}}', t.common.siteName)}</h1>
                    {(code || error || fetchError) &&
						<p className={"text-center text-red-500 text-sm"}>{code ? t.httpErrors[code] : error || fetchError}</p>}
                    {(successMessage) && <p className={"text-center text-green-500 text-sm"}>{successMessage}</p>}
                    <form data-content={"login-form"} className={className("px-2 md:px-[30px]", styles.login_form)}
                          onSubmit={handleSubmit}>
                        <InputField name={"email"} label={t.login.email} required={true}
                                    autoComplete={"email"} onChange={(e) => setEmail(e.target.value)} />
                        <InputField name={"password"} label={t.login.password} required={true}
                                    type={"password"} autoComplete={"current-password"}
                                    onChange={(e) => setPassword(e.target.value)} />
                        <div className={"relative w-full mt-2"}>
                            <button type={"button"} onClick={toggle}
                                    className={"overflow-hidden float-right text-xs text-gray-400"}>
                                {t.login.forgot}
                            </button>
                        </div>
                        <button type={"submit"} disabled={!canSubmit()}
                                className={className("mx-auto mt-5 bg-primary-400 hover:bg-primary-300 text-white rounded-2xl px-4 py-2",
                                    !canSubmit() ? "hover:cursor-not-allowed bg-primary-300" : "")}>
                            {loading ? t.common.loading : t.login.connect}
                        </button>
                        <Delimiter>{t.common.or}</Delimiter>
                        <div className={"m-auto"}>
                            <SignWithGoogle status={SignStatus.SIGN_IN} />
                        </div>
                    </form>
                    <div className={"mt-6 text-sm flex justify-center pb-5"}>
                        <p className={"text-center whitespace-nowrap"}>{t.login.new.replace('{{title}}', t.common.siteName)}&nbsp;
                            <Link href={"/register"}>
                                <a className={"underline"}>{t.login.register}</a>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default LoginForm;