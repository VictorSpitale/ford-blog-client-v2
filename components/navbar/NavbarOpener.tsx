import React, {useState} from 'react';
import styles from '../../styles/Navbar.module.css'
import {className} from "../../shared/utils/class.utils";
import NavbarContent from "./NavbarContent";
import {useTranslation} from "../../shared/hooks";
import Button from "../shared/Button";
import {useAppDispatch} from "../../context/hooks";
import {setQuery} from "../../context/actions/navSearch.actions";

const NavbarOpener = ({showButton = true}: { showButton?: boolean }) => {

    const [showContent, setShowContent] = useState(false);
    const t = useTranslation()
    const dispatch = useAppDispatch();

    const closeContent = () => {
        dispatch(setQuery({query: ""}));
        setShowContent(false);
    }

    return (
        <>
            <Button text={t.common.menu} element={"button"} onClick={() => setShowContent(true)}
                    classes={className("text-sm", styles.nav_opener_button, (!showButton || showContent) ? styles.hide : '')} />
            <NavbarContent showContent={showContent} closeContent={() => closeContent()} />
        </>
    );
};

export default NavbarOpener;