import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Token from "../../../pages/recovery/[token]";
import * as fetch from "../../../shared/hooks/useFetch";
import * as fr from "../../../public/static/locales/fr.json";
import {queryByContent} from "../../utils/CustomQueries";

describe('RecoveryTest', function () {

    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should redirect on invalid token', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Token token={"token"} />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/");
        })
    });

    it('should render password recovery page loading', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        jest.spyOn(fetch, "useFetch").mockImplementation((url, method, cb) => {
            return {
                loading: true,
                load: jest.fn(),
                code: undefined,
                error: ""
            } as never
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Token token={"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"} />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(push).not.toHaveBeenCalledWith("/");
            expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
        })
    });

    it('should render password recovery page and change password', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        jest.spyOn(fetch, "useFetch").mockImplementation((url, method, cb) => {
            return {
                loading: false,
                load: ({password}: { password: string }) => {
                    cb && cb();
                },
                code: undefined,
                error: ""
            } as never
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Token token={"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"} />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            fireEvent.change(queryByContent("password"), {target: {value: "new"}});
            fireEvent.click(screen.getByText(fr.common.save));
            expect(push).not.toHaveBeenCalled();
        })

        fireEvent.change(queryByContent("password"), {target: {value: "new_password"}});
        fireEvent.click(screen.getByText(fr.common.save));
        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/login");
        })
    });


});