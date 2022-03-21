import React, {createContext, useContext, useEffect, useState} from 'react';
import {Children} from "../shared/types/props.type";
import axios from "axios";

export const AppContext = createContext('');

export function AppWrapper({children}: { children: Children }) {
    const [uuid, setUuid] = useState('');

    useEffect(() => {
        const fetchUuid = async () => {
            const token = localStorage.getItem('token');
            await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/jwt', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                if (res.data) {
                    setUuid(res.data)
                } else {
                    localStorage.removeItem('token')
                }
            })
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