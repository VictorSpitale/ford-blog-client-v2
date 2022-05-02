import React, {useState} from 'react';
import styles from '../../styles/Navbar.module.css'
import {className} from "../../shared/utils/class.utils";
import NavbarContent from "./NavbarContent";
import {useTranslation} from "../../shared/hooks";

const NavbarOpener = ({showButton = true}: { showButton?: boolean }) => {

    const [showContent, setShowContent] = useState(false);
    const t = useTranslation()

    return (
        <>
            <button className={className(
                styles.nav_opener_button,
                (!showButton || showContent) ? styles.hide : '',
                "bg-primary-400 text-white px-2 py-1 rounded-lg shadow-md" +
                " shadow-primary-300/40 hover:shadow-primary-300/60 text-sm hover:bg-primary-500")
            } onClick={() => setShowContent(true)}>
                {t.common.menu}
            </button>
            <NavbarContent showContent={showContent} closeContent={() => setShowContent(false)} />
        </>
    );
};

export default NavbarOpener;