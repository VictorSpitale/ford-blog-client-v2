import React from 'react';
import styles from '../../styles/Register.module.css'
import Image from "next/image"
import registerImg from '../../public/static/img/cropped-1440-900-461994 (1).jpg'
import {className} from "../../shared/utils/class.utils";
import fu from "../../public/static/img/FORD _UNIVERSE.svg";
import InputField from "../shared/InputField";
import Delimiter from "../shared/Delimiter";
import SignWithGoogle, {SignStatus} from "../shared/SignWithGoogle";
import Link from 'next/link'

const RegisterForm = () => {
    return (
        <div className={className("bg-neutral-50 w-72 md:w-3/4 justify-center shadow-2xl", styles.register_container)}>
            <div className={"w-max md:w-1/2"}>
                <img src={fu.src} alt="Ford Universe Logo"
                     className={className(styles.car_logo)} />
                <h1 className={"text-lg text-center"}>Bienvenue sur Ford Universe</h1>

                <form className={className("px-2 md:px-[30px]", styles.register_form)}
                      onSubmit={(e) => e.preventDefault()}>
                    <InputField name={"email"} label={"Adresse email"} required={true} autoComplete={"email"} />
                    <InputField name={"pseudo"} label={"Pseudo"} required={true} autoComplete={"username"} />
                    <InputField name={"password"} label={"Mot de passe"} required={true} type={"password"}
                                autoComplete={"new-password"} />
                    <InputField name={"confirm-password"} label={"Confirmer votre mot de passe"} required={true}
                                type={"password"}
                                autoComplete={"new-password"} />
                    <button type={"submit"}
                            className={"mx-auto mt-5 bg-primary-400 hover:bg-primary-300 text-white rounded-2xl px-4 py-2"}>
                        S'inscrire
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