import React from 'react';
import {Children} from "../../shared/types/props.type";
import NavbarOpener from "../navbar/NavbarOpener";
import LanguageSwitcher from "../navbar/LanguageSwitcher";
import Header from "../shared/Header";
import {useRouter} from "next/router";
import {useAppSelector} from "../../context/hooks";

type PropsType = {
    children: Children;
}

const Layout = ({children}: PropsType) => {

    const router = useRouter();
    const isIndex = () => router.pathname === "/"

    const {user} = useAppSelector(state => state.user);

    return (
        <>
            <div data-content={"header"} className={"absolute h-28 flex justify-between w-full z-10 top-0"}>
                <NavbarOpener user={user} />
                {!isIndex() && <Header />}
                <LanguageSwitcher />
            </div>
            <main data-content={"main"} className={`${!isIndex() ? 'relative mt-32' : ''}`}>{children}</main>
        </>
    );
};

export default Layout;