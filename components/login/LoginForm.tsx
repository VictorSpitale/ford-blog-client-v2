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
import {useFetch} from "../../shared/hooks/useFetch";
import {IMethods} from "../../shared/types/methods.type";

const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const handleRequest = (data: { access_token: string; }) => {
        localStorage.setItem("token", data.access_token);
        if (router.pathname === "/account") {
            router.reload();
        } else {
            router.push('/account')
        }
    }

    const {load, loading, error: fetchError} = useFetch('/auth/login', IMethods.POST, handleRequest);

    useEffect(() => {
        if (router.query.status && router.query.status === "failed") {
            setError("L'authentification a échouée")
        } else if (router.query.register && router.query.register === "success") {
            setSuccessMessage("Votre inscription a été prise en compte")
        }
    }, [router])

    const canSubmit = (): boolean => {
        return (email !== "" && password !== "" && password.length >= 6);
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!canSubmit()) {
            setError("Veuillez remplir tous les champs");
            return;
        }
        if (!validateEmail(email)) {
            setError("Email non conforme");
            return;
        }
        await load({email, password});
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
                <div className={styles.car_logo}>
                    <Image width={"159"} height={"53"} src={fu.src} alt="Ford Universe Logo" />
                </div>
                <h1 className={"text-lg text-center"}>Bienvenue sur Ford Universe</h1>
                {(error || fetchError) && <p className={"text-center text-red-500 text-sm"}>{error || fetchError}</p>}
                {(successMessage) && <p className={"text-center text-green-500 text-sm"}>{successMessage}</p>}
                <form className={className("px-2 md:px-[30px]", styles.login_form)}
                      onSubmit={handleSubmit}>
                    <InputField name={"email"} label={"Adresse email"} required={true}
                                autoComplete={"email"} onChange={(e) => setEmail(e.target.value)} />
                    <InputField name={"password"} label={"Mot de passe"} required={true}
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