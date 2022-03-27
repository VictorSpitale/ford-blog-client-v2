import React, {FormEvent, useEffect, useRef, useState} from 'react';
import styles from '../../styles/Login.module.css'
import Image from "next/image"
import loginImg from '../../public/static/img/cropped-500-500-318084.jpg'
import {className} from "../../shared/utils/class.utils";
import fu from "../../public/static/img/FORD _UNIVERSE.svg";
import InputField from "../shared/InputField";
import Delimiter from "../shared/Delimiter";
import SignWithGoogle, {SignStatus} from "../shared/SignWithGoogle";
import Link from 'next/link'
import {validateEmail} from "../../shared/utils/regex.utils";
import axios from "axios";
import {useRouter} from "next/router";

const LoginForm = () => {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (router.query.status && router.query.status === "failed") {
            setError("L'authentification a échouée")
        }
    }, [router])

    const canSubmit = (): boolean => {
        return (email !== "" && password !== "" && password.length >= 6);
    }

    const resetWithError = (error: string) => {
        setError(error);
        setLoading(false);
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!canSubmit()) {
            resetWithError("Veuillez remplir tous les champs");
            return;
        }
        if (!validateEmail(email)) {
            resetWithError("Email non conforme");
            return;
        }
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email, password
        }).then((res) => {
            localStorage.setItem("token", res.data.access_token);
            if (router.pathname === "/account") {
                router.reload();
            } else {
                router.push('/account')
            }
        }).catch((res) => {
            resetWithError(res.response.data.message)
        })
    }


    return (
        <div
            className={className("bg-neutral-50 w-72 md:w-3/4 justify-center shadow-2xl", styles.login_container)}>
            <div className={className("hidden md:block bg-primary-100", styles.login_container_left)}>
                <div className={styles.form_img_container}>
                    <Image src={loginImg.src} className={styles.form_img} layout={"fill"} objectFit={"cover"}
                           alt={"Login background image"} priority />
                </div>
                <div className={styles.form_left_text_container}>
                    <h1 className={"text-xl text-center"}>Ford Universe Blog</h1>
                    <p className={"text-center mx-4 mt-3 lg:text-lg"}>Découvre cette emblématique marque
                        américaine à
                        travers une communauté de passionnés</p>
                </div>
            </div>
            <div className={"w-max md:w-1/2"}>
                <img src={fu.src} alt="Ford Universe Logo"
                     className={className(styles.car_logo)} />
                <h1 className={"text-lg text-center"}>Bienvenue sur Ford Universe</h1>
                {error && <p className={"text-center text-red-500 text-sm"}>{error}</p>}
                <form className={className("px-2 md:px-[30px]", styles.login_form)}
                      onSubmit={handleSubmit}>
                    <InputField ref={emailRef} name={"email"} label={"Adresse email"} required={true}
                                autoComplete={"email"} onChange={(e) => setEmail(e.target.value)} />
                    <InputField ref={passwordRef} name={"password"} label={"Mot de passe"} required={true}
                                type={"password"} autoComplete={"current-password"}
                                onChange={(e) => setPassword(e.target.value)} />
                    <div className={"relative w-full mt-2"}>
                        <button type={"button"}
                                className={"overflow-hidden float-right text-xs text-gray-400"}>
                            Mot de passe oublié ?
                        </button>
                    </div>
                    <button type={"submit"} disabled={!canSubmit()}
                            className={className("mx-auto mt-5 bg-primary-400 hover:bg-primary-300 text-white rounded-2xl px-4 py-2",
                                !canSubmit() ? "hover:cursor-not-allowed bg-primary-300" : "")}>
                        {loading ? "Chargement..." : "Se connecter"}
                    </button>
                    <Delimiter>Ou</Delimiter>
                    <div className={"m-auto"}>
                        <SignWithGoogle status={SignStatus.SIGN_IN} />
                    </div>
                </form>
                <div className={"mt-6 text-sm flex justify-center pb-5"}>
                    <p className={"text-center whitespace-nowrap"}>Nouveau sur Ford Universe ?&nbsp;
                        <Link href={"/register"}>
                            <a className={"underline"}>Inscris-toi</a>
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default LoginForm;