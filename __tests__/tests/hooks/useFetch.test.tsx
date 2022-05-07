import {PostStub} from "../../stub/PostStub";
import axios from "axios";
import {useFetch, useTranslation} from "../../../shared/hooks";
import {IMethods} from "../../../shared/types/methods.type";
import {act, render} from "@testing-library/react";
import {TestHook} from "../../utils/TestHook";
import {AnyFunction} from "../../../shared/types/props.type";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../utils/MockUseRouter";
import fr from '../../../public/static/locales/fr.json'

jest.mock('axios');
jest.mock('../../../shared/hooks', () => {
    const original = jest.requireActual('../../../shared/hooks');
    return {
        __esModule: true,
        ...original,
        useTranslation: jest.fn()
    }
})

describe('Use Fetch', function () {

    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV};
    })

    afterAll(() => {
        process.env = OLD_ENV;
    })

    let fetchObj: { loading: boolean; load: AnyFunction; error: string; clear: () => void; code?: number; };
    it('should fetch posts', async () => {
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";
        const posts = [PostStub()];
        const res = {data: posts};
        (axios as unknown as jest.Mock).mockResolvedValue(res);
        (useTranslation as jest.Mock).mockReturnValue(fr);
        let result;
        render(
            <RouterContext.Provider value={MockUseRouter({locale: "fr"})}>
                <TestHook callback={() => {
                    fetchObj = useFetch('/posts', IMethods.GET, (res) => {
                        result = res
                    });
                }} />
            </RouterContext.Provider>)
        expect(fetchObj.loading).toBe(false);
        await act(async () => await fetchObj.load());
        expect(axios).toHaveBeenCalledWith({
            data: undefined,
            method: IMethods.GET,
            url: `${process.env.NEXT_PUBLIC_API_URL}/posts`,
            withCredentials: true
        });
        expect(fetchObj.loading).toBe(false);
        expect(result).toEqual(res.data);
        expect(fetchObj.code).not.toBeDefined();
        expect(fetchObj.error).toBe("");
        act(() => fetchObj.clear());
        expect(fetchObj.error).toBe("");
    })

    it('should fetch without callback', async () => {
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";
        (axios as unknown as jest.Mock).mockResolvedValue(null);
        (useTranslation as jest.Mock).mockReturnValue(fr);
        render(
            <RouterContext.Provider value={MockUseRouter({locale: "fr"})}>
                <TestHook callback={() => {
                    fetchObj = useFetch('/posts', IMethods.GET);
                }} />
            </RouterContext.Provider>
        )
        expect(axios).toHaveBeenCalledWith({
            data: undefined,
            method: IMethods.GET,
            url: `${process.env.NEXT_PUBLIC_API_URL}/posts`,
            withCredentials: true
        });
    })

    it('should fail to fetch posts, rejected with a code', async () => {
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";
        const res = {response: {data: {message: 'Post not found', statusCode: 404, code: 5}}};
        (axios as unknown as jest.Mock).mockRejectedValue(res);
        (useTranslation as jest.Mock).mockReturnValue(fr);
        let result;
        render(
            <RouterContext.Provider value={MockUseRouter({locale: "fr"})}>
                <TestHook callback={() => {
                    fetchObj = useFetch('/posts', IMethods.GET, (res) => {
                        result = res
                    });
                }} />
            </RouterContext.Provider>
        )
        expect(fetchObj.loading).toBe(false);
        await act(async () => await fetchObj.load());
        expect(result).not.toBeDefined();
        expect(axios).toHaveBeenCalledWith({
            data: undefined,
            method: IMethods.GET,
            url: `${process.env.NEXT_PUBLIC_API_URL}/posts`,
            withCredentials: true
        });
        expect(fetchObj.loading).toBe(false);
        expect(fetchObj.code).toBe(res.response.data.code);
        expect(fetchObj.error).toBe(res.response.data.message);
        act(() => fetchObj.clear());
        expect(fetchObj.error).toBe("");
    })

    it('should fail to fetch posts, rejected with a basic error message if response doesnt match basic response', async () => {
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";
        const res = {response: {data: {error: 'Post not found'}}};
        (axios as unknown as jest.Mock).mockRejectedValue(res);
        (useTranslation as jest.Mock).mockReturnValue(fr);
        render(
            <RouterContext.Provider value={MockUseRouter({locale: "fr"})}>
                <TestHook callback={() => {
                    fetchObj = useFetch('/posts');
                }} />
            </RouterContext.Provider>)
        await act(async () => await fetchObj.load());
        expect(axios).toHaveBeenCalledWith({
            data: undefined,
            method: IMethods.POST,
            url: `${process.env.NEXT_PUBLIC_API_URL}/posts`,
            withCredentials: true
        });
        expect(fetchObj.error).toBe(fr.common.errorSub)
        expect(fetchObj.code).not.toBeDefined();
    })

});