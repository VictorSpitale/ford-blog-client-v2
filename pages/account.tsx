import React from 'react';
import {useAppContext} from "../context/AppContext";
import Login from "./login";

const Account = () => {
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