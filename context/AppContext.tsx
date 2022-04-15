import React, {createContext, useContext, useEffect, useState} from 'react';
import {Children} from "../shared/types/props.type";
import axios from "axios";

export const AppContext = createContext('');

export function AppWrapper({children}: { children: Children }) {
    const [uuid, setUuid] = useState('');

    useEffect(() => {
        const fetchUuid = async () => {
            await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/jwt', {
                withCredentials: true
            }).then((res) => {
                if (res.data) {
                    setUuid(res.data)
                }
            }).catch(() => null)
        };
        fetchUuid();
    }, [])

    return (
        <AppContext.Provider value={uuid}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}