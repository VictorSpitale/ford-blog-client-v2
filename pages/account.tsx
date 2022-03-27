import React, {useEffect} from 'react';
import {useAppContext} from "../context/AppContext";
import Login from "./login";
import {useRouter} from "next/router";

const Account = () => {

    const router = useRouter();

    useEffect(() => {
        if (router.query.token) {
            const {token} = router.query;
            if (typeof token === "string") {
                localStorage.setItem("token", token)
            }
            location.href = "/account";
        }
    }, [router])


    const uuid = useAppContext();

    if (!uuid) {
        return <Login />
    }

    return (
        <div>
            Mon Compte
        </div>
    );
};

export default Account;