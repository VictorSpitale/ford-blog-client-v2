import {useFetch, useTranslation} from "../../../../shared/hooks";
import * as fr from "../../../../public/static/locales/fr.json";
import {act, fireEvent, render, screen} from "@testing-library/react";
import NavSearch from "../../../../components/navbar/NavSearch";
import {queryByContent} from "../../../utils/CustomQueries";
import React from "react";
import axios from "axios";
import {PostStub} from "../../../stub/PostStub";
import {IMethods} from "../../../../shared/types/methods.type";
import {AnyFunction} from "../../../../shared/types/props.type";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../utils/MockUseRouter";

jest.mock('../../../../shared/hooks');
jest.mock('axios');

describe('NavSearch', function () {

    describe('Without result', function () {
        const load = jest.fn();
        beforeEach(() => {
            (useTranslation as jest.Mock).mockReturnValue(fr);
            (useFetch as jest.Mock).mockReturnValue({
                load
            });
        })

        afterEach(() => {
            load.mockClear();
        })
        it('should render the nav search and type less then 3 characters', () => {
            const fn = jest.fn();
            render(
                <NavSearch onClick={fn} />
            )
            const input = screen.getByPlaceholderText(fr.common.keywords);
            expect(input).toBeInTheDocument();
            expect(queryByContent("result-container").children.length).toBe(0);
            act(() => {
                fireEvent.change(input, {target: {value: "p"}})
            })
            expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
        })

        it('should render the nav search and fetch correct type', async () => {
            const fn = jest.fn();
            render(
                <NavSearch onClick={fn} />
            )
            const input = await screen.findByPlaceholderText(fr.common.keywords);
            await act(async () => {
                fireEvent.change(input, {target: {value: "Mus"}})
            })
            expect(load).toHaveBeenCalledTimes(1);
        })
        it('should not re-fetch if query is similar', async () => {
            const fn = jest.fn();
            render(
                <NavSearch onClick={fn} />
            )
            const input = await screen.findByPlaceholderText(fr.common.keywords);
            await act(async () => {
                fireEvent.change(input, {target: {value: "Mus"}})
            })
            expect(load).toHaveBeenCalledTimes(1);

            await act(async () => {
                fireEvent.change(input, {target: {value: "Musss"}})
            })

            expect(load).toHaveBeenCalledTimes(1);

            await act(async () => {
                fireEvent.change(input, {target: {value: "Musss"}})
            })

            expect(load).toHaveBeenCalledTimes(1);
        })
    });

    describe('With result', function () {
        const load = jest.fn();
        const callbackFn = jest.fn();
        const posts = [PostStub()];
        const res = {data: posts};
        beforeEach(() => {
            (axios as unknown as jest.Mock).mockResolvedValue(res);
            (useTranslation as jest.Mock).mockReturnValue(fr);
            (useFetch as jest.Mock).mockImplementationOnce(async (url: string, method = IMethods.POST, callback?: AnyFunction) => {
                await axios({
                    method,
                    data: undefined,
                    url: "https://localhost:5000" + url,
                    withCredentials: true
                }).then((res) => {
                    if (callback) {
                        callback(res.data);
                        callbackFn();
                    }
                })
            }).mockReturnValue({
                load
            });
        })

        afterEach(() => {
            load.mockClear();
        })

        it('should set posts', async () => {
            const fn = jest.fn();
            const router = MockUseRouter({locale: "fr"});
            render(
                <RouterContext.Provider value={router}>
                    <NavSearch onClick={fn} />
                </RouterContext.Provider>
            )
            const input = await screen.findByPlaceholderText(fr.common.keywords);
            await act(async () => {
                fireEvent.change(input, {target: {value: "Mus"}})
            })
            expect(load).toHaveBeenCalledTimes(1);
            expect(callbackFn).toHaveBeenCalledTimes(1);
            const card = queryByContent('result-container').children[0];
            expect(card).toHaveAttribute('href', `/post/${posts[0].slug}`)
            fireEvent.click(card);
            expect(fn).toHaveBeenCalled();
        })
    });

});