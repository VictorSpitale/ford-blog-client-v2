import React, {useCallback, useEffect} from 'react';
import {AnyFunction} from "../../shared/types/props.type";
import styles from '../../styles/Navbar.module.css'
import {className} from "../../shared/utils/class.utils";
import fu from '../../public/static/img/FORD _UNIVERSE White.svg'
import NavLink from "./NavLink";
import Image from 'next/image'
import searchBackground from '../../public/static/img/search_background-3.jpg'
import NavSearch from "./NavSearch";

const NavbarContent = ({showContent, closeContent}: { showContent: boolean; closeContent: AnyFunction }) => {

    const links = [{
        label: "Accueil",
        href: "/"
    }, {
        label: "Actualités",
        href: "/news"
    }, {
        label: "Catégories",
        href: "/categories"
    }, {
        label: "Poster",
        href: "/write"
    }, {
        label: "Contact",
        href: "/contact"
    }, {
        label: "Mon compte",
        href: "/account"
    }]

    const close = useCallback((ev: KeyboardEvent) => {
        if (ev.key === "Escape") closeContent()
    }, [closeContent])

    useEffect(() => {
        window.addEventListener('keydown', close);

        return () => {
            window.removeEventListener('keydown', close)
        }
    }, [close]);

    return (
        <div className={className("bg-gray-50", styles.nav, (!showContent ? styles.hide : ''))}>
            <div className={className(styles.nav_header, "bg-dark-500 drop-shadow shadow-lg")}>
                <img src={fu.src} alt="Ford Universe Logo"
                     className={className(styles.car_logo)} />

                <button onClick={closeContent}
                        className={className("shadow drop-shadow-lg bg-red-400 hover:bg-red-500", styles.nav_close_btn)}>
                    <svg style={{width: "36px", height: "36px"}} viewBox="0 0 24 24">
                        <path fill="white"
                              d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                    </svg>
                </button>
            </div>
            <div className={styles.nav_content}>

                <ul className={className("bg-dark-500", styles.nav_links)}>
                    {links.map((link, i) => {
                        return <li key={i} onClick={closeContent}
                                   className={"shadow drop-shadow hover:bg-primary-300 text-white"}>
                            <NavLink href={link.href} label={link.label} />
                        </li>
                    })}
                </ul>

                <div className={styles.search_container}>
                    <div className={styles.search_img_container}>
                        <Image src={searchBackground.src} className={styles.search_img} layout="fill"
                               alt={"Search background image"} />
                    </div>
                    <NavSearch onClick={closeContent} />
                </div>
            </div>
        </div>
    );
};

export default NavbarContent;