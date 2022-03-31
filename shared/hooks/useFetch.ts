import {AnyFunction} from "../types/props.type";
import {useCallback, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {IMethods} from "../types/methods.type";

export function useFetch(url: string, method = IMethods.POST, callback: AnyFunction) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const load = useCallback(
        async (data: unknown) => {
            setLoading(true);
            await axios({
                method,
                url: process.env.NEXT_PUBLIC_API_URL + url,
                withCredentials: true,
                data,
            } as AxiosRequestConfig)
                .then((res) => {
                    setLoading(false);
                    if (callback) callback(res.data);
                })
                .catch((e) => {
                    setError(e.response.data.message || "Erreur")
                    setLoading(false);
                });
        },
        [url, method, callback],
    );

    const clear = useCallback(() => {
        if (error) setError('');
    }, [error]);

    return {
        loading,
        error,
        load,
        clear,
    };
}
