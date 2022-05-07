import {AnyFunction} from "../types/props.type";
import {useCallback, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {IMethods} from "../types/methods.type";
import {useTranslation} from "./useTranslation";

export function useFetch(url: string, method = IMethods.POST, callback?: AnyFunction) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState(undefined);
    const t = useTranslation();

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
                    /* istanbul ignore else */
                    if (callback) callback(res.data);
                })
                .catch((e) => {
                    if (e.response?.data.code) setCode(e.response.data.code)
                    setError(e.response?.data.message || t.common.errorSub)
                    setLoading(false);
                });
        },
        [method, url, callback, t.common.errorSub],
    );

    const clear = useCallback(() => {
        if (error) setError('');
    }, [error]);

    return {
        loading,
        error,
        load,
        clear,
        code
    };
}
