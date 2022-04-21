import React from 'react';
import {Children} from "../../shared/types/props.type";
import NavbarOpener from "../navbar/NavbarOpener";
import LanguageSwitcher from "../navbar/LanguageSwitcher";
import Header from "../shared/Header";
import {useRouter} from "next/router";

const Layout = ({children}: { children: Children }) => {

    const router = useRouter();
    const isIndex = () => router.pathname === "/"
    return (
        <>
            <div className={"absolute h-28 flex justify-between w-full z-10 top-0"}>
                <NavbarOpener />
                {!isIndex() && <Header />}
                <LanguageSwitcher />
            </div>
            <main className={`${!isIndex() ? 'relative top-28' : ''}`}>{children}</main>
        </>
    );
};

export default Layout;