import React from 'react';
import {Children} from "../../shared/types/props.type";
import NavbarOpener from "../navbar/NavbarOpener";
import LanguageSwitcher from "../navbar/LanguageSwitcher";

const Layout = ({children}: { children: Children }) => {


    return (
        <>
            <div className={"absolute flex justify-between w-full z-10 top-0"}>
                <NavbarOpener />
                <LanguageSwitcher />
            </div>
            <main>{children}</main>
        </>
    );
};

export default Layout;