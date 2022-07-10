import React from 'react';
import {Children} from "../../shared/types/props.type";
import NavbarOpener from "../navbar/NavbarOpener";
import LanguageSwitcher from "../navbar/LanguageSwitcher";
import Header from "../shared/Header";
import {useRouter} from "next/router";

type PropsType = {
    children: Children;
}

const Layout = ({children}: PropsType) => {

    const router = useRouter();
    const isIndex = () => router.pathname === "/"
    return (
        <>
            <div data-content={"header"} className={"absolute h-28 flex justify-between w-full z-10 top-0"}>
                <NavbarOpener />
                {!isIndex() && <Header />}
                <LanguageSwitcher />
            </div>
            <main data-content={"main"} className={`${!isIndex() ? 'relative mt-32' : ''}`}>{children}</main>
        </>
    );
};

export default Layout;