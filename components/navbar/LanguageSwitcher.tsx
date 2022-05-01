import React from 'react';
import {className} from "../../shared/utils/class.utils";
import styles from "../../styles/Navbar.module.css";
import {useRouter} from "next/router";

const LanguageSwitcher = () => {

    const router = useRouter();
    const {locales, locale} = router;

    const langueOptions = () => {
        return locales?.map((l, index) => {
            /* istanbul ignore else */
            if (l !== locale) {
                return <li key={index} onClick={() => handleChange(l)}>
                    <div className={styles[l]} />
                </li>
            }
        })
    }

    const handleChange = (l: string) => {
        router.push(router.asPath, router.asPath, {locale: l})
    }

    return (
        <div className={className(styles.select_language, "relative top-0 right-[10px]")}>
            <div data-content={"current-language"} className={styles[locale || "fr"]} />
            <ul className={styles.dropdown}>
                {langueOptions()}
            </ul>
        </div>
    );
};

export default LanguageSwitcher;