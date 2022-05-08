import axios, {AxiosResponse} from "axios";
import {
    FailureResponse,
    FetchOptions,
    PathParameters,
    QueryParameters,
    RequestBody,
    SuccessResponse
} from "../shared/types/openapi/api";
import {paths} from "../shared/types/openapi/generated-schema";

export const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

instance.interceptors.response.use(function (response) {
    return response
}, function (error) {
    let newError;
    if (error.response) {
        newError = error.response.data;
    } else if (error.request) {
        newError = {message: "Error occurred during request"};
    } else {
        newError = {message: "Error occurred during request"};
    }
    return Promise.reject<FailureResponse>(newError);
})

export function objToQueryParams<O extends Record<string, string>>(
    o: O,
    p?: URLSearchParams
) {
    const params = p || new URLSearchParams();
    Object.keys(o)
        .filter((k: keyof O) => o[k] !== undefined)
        .forEach((k: string) => params.set(k, o[k]!));
    return params;
}

export async function fetchApi<Path extends keyof paths,
    Method extends keyof paths[Path]>(
    path: Path,
    options: FetchOptions<Method,
        QueryParameters<paths[Path][Method]>,
        PathParameters<paths[Path][Method]>,
        RequestBody<paths[Path][Method]>>
): Promise<AxiosResponse<SuccessResponse<paths[Path][Method]>>> {
    const opt = {...options};

    const url = new URL(process.env.NEXT_PUBLIC_API_URL!);
    url.pathname = (url.pathname === "/" ? "" : url.pathname) + path;

    if ("json" in opt) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        opt["json"] = JSON.stringify(opt['json']);
    }

    if ("query" in opt) {
        objToQueryParams(opt["query"], url.searchParams);
    }

    if ("params" in opt) {
        Object.keys(opt["params"]).forEach(
            (key) => (url.pathname = url.pathname.replace(`%7B${key}%7D`, opt["params"][key]))
        );
    }

    return instance({
        baseURL: url.origin,
        url: url.pathname,
        params: ("query" in opt) ? opt["query"] : undefined,
        data: ("json" in opt) ? opt["json"] : undefined
    });
}