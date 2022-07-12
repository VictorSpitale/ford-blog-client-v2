import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import PasswordRecoveryModal from "../../../../../components/login/modals/PasswordRecoveryModal";
import * as fr from '../../../../../public/static/locales/fr.json'
import * as fetch from "../../../../../shared/hooks/useFetch";
import {queryByContent} from "../../../../utils/CustomQueries";

describe('PasswordRecoveryModalTest', function () {

    it('should render the modal', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PasswordRecoveryModal isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("pr-modal")).toBeInTheDocument();
    });

    it('should render the modal with error', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PasswordRecoveryModal isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )
        const btn = screen.getByText(fr.login.recovery.action);
        const input = screen.getByLabelText(fr.login.email);

        expect(btn).toBeInTheDocument();

        fireEvent.click(btn);

        expect(screen.getByText(fr.login.error.email)).toBeInTheDocument();

        fireEvent.change(input, {target: {value: "arzerzaare"}});

        fireEvent.click(btn);

        expect(screen.getByText(fr.login.error.email)).toBeInTheDocument();
    });

    it('should send the mail', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const submit = jest.fn();

        jest.spyOn(fetch, "useFetch").mockImplementation((url, method, cb) => {
            return {
                loading: false,
                load: ({email, locale}: { email: string, locale: string }) => {
                    submit({email, locale});
                    cb && cb();
                },
            } as never
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PasswordRecoveryModal isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        const btn = screen.getByText(fr.login.recovery.action);
        const input = screen.getByLabelText(fr.login.email);

        const email = "vmairets@gmail.com";
        act(() => {
            fireEvent.change(input, {target: {value: email}});
        })
        act(() => {
            fireEvent.click(btn);
        })
        await waitFor(() => {
            expect(submit).toHaveBeenCalledWith({email, locale: "fr"});
        })

        expect(screen.getByText(new RegExp(fr.login.recovery.text))).toBeInTheDocument();

    });

    it('should render the modal loading', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const submit = jest.fn();

        jest.spyOn(fetch, "useFetch").mockReturnValue({
                loading: true,
                load: submit,
            } as never
        );

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PasswordRecoveryModal isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();

    });


});