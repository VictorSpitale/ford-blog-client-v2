import React from 'react';
import {Children} from "../../shared/types/props.type";
import NavbarOpener from "../navbar/NavbarOpener";

const Layout = ({children}: { children: Children }) => {
    return (
        <>
            <NavbarOpener />
            <main>{children}</main>
        </>
    );
};

export default Layout;