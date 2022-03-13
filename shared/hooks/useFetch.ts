import {AnyFunction} from "../types/props.type";
import {useCallback, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {IMethods} from "../types/methods.type";

export function useFetch(url: string, method = IMethods.POST, callback: AnyFunction) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const load = useCallback(
        async (data) => {
            setLoading(true);
            await axios({
                method,
                url: process.env.NEXT_PUBLIC_API_URL + url,
                withCredentials: true,
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                },
                data,
            } as AxiosRequestConfig)
                .then((res) => {
                    setLoading(false);
                    if (callback) callback(res.data);
                })
                .catch((e) => {
                    setError(e.response && e.response.data ? e.response.data : "Error");
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
