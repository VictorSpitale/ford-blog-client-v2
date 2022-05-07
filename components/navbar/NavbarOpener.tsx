import React, {useState} from 'react';
import styles from '../../styles/Navbar.module.css'
import {className} from "../../shared/utils/class.utils";
import NavbarContent from "./NavbarContent";
import {useTranslation} from "../../shared/hooks";
import Button from "../shared/Button";

const NavbarOpener = ({showButton = true}: { showButton?: boolean }) => {

    const [showContent, setShowContent] = useState(false);
    const t = useTranslation()

    return (
        <>
            <Button text={t.common.menu} element={"button"} onClick={() => setShowContent(true)}
                    classes={className("text-sm", styles.nav_opener_button, (!showButton || showContent) ? styles.hide : '')} />
            <NavbarContent showContent={showContent} closeContent={() => setShowContent(false)} />
        </>
    );
};

export default NavbarOpener;