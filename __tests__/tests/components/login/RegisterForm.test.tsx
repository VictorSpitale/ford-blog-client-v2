import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import RegisterForm from "../../../../components/login/RegisterForm";
import {queryByContent} from "../../../utils/CustomQueries";
import * as fr from "../../../../public/static/locales/fr.json";
import * as fetch from "../../../../shared/hooks/useFetch";

describe('RegisterFormTest', function () {

    let submit: jest.Mock;
    let fetchError: string;
    let code: undefined | number;
    let loading = false;

    beforeEach(() => {
        submit = jest.fn();
        fetchError = "";
        code = undefined;

        jest.spyOn(fetch, "useFetch").mockImplementation((url, method, cb) => {
            return {
                loading,
                load: ({email, pseudo, password}: { email: string, pseudo: string, password: string }) => {
                    submit({email, pseudo, password});
                    cb && cb();
                },
                code,
                error: fetchError
            } as never
        });
    })

    afterEach(() => {
        if (submit) submit.mockClear();
        loading = false;
        code = undefined;
        fetchError = "";
    })

    it('should render the register form', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <RegisterForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("register-form")).toBeInTheDocument();
        expect(screen.getByText(fr.common.desc)).toBeInTheDocument();
        expect(screen.getByText(fr.common.fullSiteName)).toBeInTheDocument();
        expect(screen.getByText(fr.register.register)).toBeInTheDocument();
        expect(screen.getByText(fr.register.register)).toBeDisabled();
        expect(screen.getByText(fr.register.signIn)).toBeInTheDocument();
        expect(screen.getByText(fr.register.register)).toHaveClass("hover:cursor-not-allowed");

        // Fields

        expect(screen.getByLabelText(fr.register.email)).toBeInTheDocument();
        expect(screen.getByLabelText(fr.register.password)).toBeInTheDocument();
        expect(screen.getByLabelText(fr.register.confPassword)).toBeInTheDocument();
        expect(screen.getByLabelText(fr.register.pseudo)).toBeInTheDocument();
    });

    it('should render the register form loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        loading = true;

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <RegisterForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
    });

    it('should render the form with error', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <RegisterForm />
                </RouterContext.Provider>
            </Provider>
        )

        const pseudo = screen.getByLabelText(fr.register.pseudo);
        const email = screen.getByLabelText(fr.register.email);
        const password = screen.getByLabelText(fr.register.password);
        const confPassword = screen.getByLabelText(fr.register.confPassword);
        const btn = screen.getByText(fr.register.register) as HTMLButtonElement;

        fireEvent.change(pseudo, {target: {value: "e"}});
        fireEvent.change(email, {target: {value: "e"}});
        fireEvent.change(password, {target: {value: "e"}});
        fireEvent.change(confPassword, {target: {value: "e"}});

        // Force enable (html changes) to check canSubmit
        btn.disabled = false;

        fireEvent.click(btn);
        expect(screen.getByText(fr.register.error.fields)).toBeInTheDocument();

        fireEvent.change(pseudo, {target: {value: "pseudo"}});
        fireEvent.change(email, {target: {value: "wrong_email"}});
        fireEvent.change(password, {target: {value: "password"}});
        fireEvent.change(confPassword, {target: {value: "wrong_password"}});

        fireEvent.click(btn);
        expect(screen.getByText(fr.register.error.email)).toBeInTheDocument();

        fireEvent.change(email, {target: {value: "vmairets@gmail.com"}});

        fireEvent.click(btn);
        expect(screen.getByText(fr.register.error.password)).toBeInTheDocument();

        fireEvent.change(password, {target: {value: "password"}});
        fireEvent.change(confPassword, {target: {value: "password"}});

        fireEvent.click(btn);

        code = 6;

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <RegisterForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.httpErrors["6"])).toBeInTheDocument();

        code = undefined;
        fetchError = "fetching error...";

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <RegisterForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fetchError)).toBeInTheDocument();
    });

    it('should register a user', function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <RegisterForm />
                </RouterContext.Provider>
            </Provider>
        )

        const pseudo = screen.getByLabelText(fr.register.pseudo);
        const email = screen.getByLabelText(fr.register.email);
        const password = screen.getByLabelText(fr.register.password);
        const confPassword = screen.getByLabelText(fr.register.confPassword);
        const btn = screen.getByText(fr.register.register) as HTMLButtonElement;

        fireEvent.change(pseudo, {target: {value: "pseudo"}});
        fireEvent.change(email, {target: {value: "vmairets@gmail.com"}});
        fireEvent.change(password, {target: {value: "password"}});
        fireEvent.change(confPassword, {target: {value: "password"}});

        fireEvent.click(btn);

        expect(push).toHaveBeenCalledWith("/login?register=success");
    });

});