import React, {createContext, useContext, useEffect, useState} from 'react';
import {Children} from "../shared/types/props.type";
import {useAppDispatch} from "./hooks";
import {getUser} from "./actions/user.actions";
import {getCategories} from "./actions/categories.actions";

export const AppContext = createContext('');

export function AppWrapper({children}: { children: Children }) {
    const [uuid, setUuid] = useState('');
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchUuid = async () => {
            await dispatch(getUser(setUuid))
        };
        const fetchInitialData = async () => {
            await dispatch(getCategories());
        }
        fetchUuid();
        fetchInitialData();
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