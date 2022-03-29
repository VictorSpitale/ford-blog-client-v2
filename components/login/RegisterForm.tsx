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

const RegisterForm = () => {

    const [email, setEmail] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const canSubmit = (): boolean => {
        return (email !== "" && password !== "" && pseudo !== ""
            && confPassword !== "" && password.length >= 6 && confPassword.length >= 6
            && pseudo.length >= 6 && pseudo.length <= 18);
    }

    const handleRequest = () => {
        router.push("/login?register=success")
    }

    const {loading, load, error: fetchError} = useFetch("/users", IMethods.POST, handleRequest);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!canSubmit()) {
            setError("Veuillez remplir tous les champs");
            return;
        }
        if (!validateEmail(email)) {
            setError("Email non conforme");
            return;
        }
        if (password !== confPassword) {
            setError("Les mots de passe ne correspondent pas");
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
                <h1 className={"text-lg text-center"}>Bienvenue sur Ford Universe</h1>
                {(error || fetchError) && <p className={"text-center text-red-500 text-sm"}>{error || fetchError}</p>}
                <form className={className("px-2 md:px-[30px]", styles.register_form)}
                      onSubmit={handleSubmit}>
                    <InputField name={"email"} label={"Adresse email"} required={true} autoComplete={"email"}
                                onChange={(e => setEmail(e.target.value))} />
                    <InputField name={"pseudo"} label={"Pseudo"} required={true} autoComplete={"username"}
                                onChange={(e => setPseudo(e.target.value))} />
                    <InputField name={"password"} label={"Mot de passe"} required={true} type={"password"}
                                autoComplete={"new-password"} onChange={(e => setPassword(e.target.value))} />
                    <InputField name={"confirm-password"} label={"Confirmer votre mot de passe"} required={true}
                                type={"password"} autoComplete={"new-password"}
                                onChange={(e => setConfPassword(e.target.value))} />
                    <button type={"submit"} disabled={!canSubmit()}
                            className={className("mx-auto mt-5 bg-primary-400 hover:bg-primary-300 text-white rounded-2xl px-4 py-2",
                                !canSubmit() ? "hover:cursor-not-allowed bg-primary-300" : "")}>
                        {loading ? "Chargement..." : "S'inscrire"}
                    </button>
                    <Delimiter>Ou</Delimiter>
                    <div className={"m-auto"}>
                        <SignWithGoogle status={SignStatus.SIGN_UP} />
                    </div>
                </form>
                <div className={"mt-6 text-sm flex justify-center pb-5"}>
                    <p className={"text-center whitespace-nowrap"}>Tu as déjà un compte ?&nbsp;
                        <Link href={"/login"}>
                            <a className={"underline"}>Connecte-toi</a>
                        </Link>
                    </p>
                </div>

            </div>
            <div className={className("hidden md:block bg-primary-100", styles.register_container_left)}>
                <div className={styles.form_img_container}>
                    <Image src={registerImg.src} className={styles.form_img} layout={"fill"} objectFit={"cover"}
                           alt={"register background image"} priority />
                </div>
                <div className={styles.form_left_text_container}>
                    <h1 className={"text-xl text-center text-white"}>Ford Universe Blog</h1>
                    <p className={"text-center mx-4 mt-3 lg:text-lg text-white"}>Découvre cette emblématique marque
                        américaine à
                        travers une communauté de passionnés</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;