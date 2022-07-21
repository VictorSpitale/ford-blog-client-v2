import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import LoginForm from "../../../../components/login/LoginForm";
import {queryByContent} from "../../../utils/CustomQueries";
import * as fr from '../../../../public/static/locales/fr.json'
import * as fetch from "../../../../shared/hooks/useFetch";
import * as actions from '../../../../context/actions/users/user.actions'
import {LOGIN} from '../../../../context/actions/users/user.actions'
import {UserStub} from "../../../stub/UserStub";
import {IUser} from "../../../../shared/types/user.type";

describe('LoginFormTest', function () {


    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should render the login form', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("login-form")).toBeInTheDocument();
        expect(screen.getByText(fr.common.desc)).toBeInTheDocument();
        expect(screen.getByText(fr.common.fullSiteName)).toBeInTheDocument();
        expect(screen.getByText(fr.login.connect)).toBeInTheDocument();
        expect(screen.getByText(fr.login.connect)).toBeDisabled();
        expect(screen.getByText(fr.login.register)).toBeInTheDocument();
        expect(screen.getByText(fr.login.forgot)).toBeInTheDocument();
        expect(screen.getByText(fr.login.connect)).toHaveClass("hover:cursor-not-allowed");
    });

    it('should render the login form with error', function () {
        const store = makeStore();
        const router = MockUseRouter({query: {status: "failed"}});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.login.failed));
    });

    it('should render the login form with register success message', function () {
        const store = makeStore();
        const router = MockUseRouter({query: {register: "success"}});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.login.success));
    });

    it('should render the login form loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const submit = jest.fn();
        const fetchError = "";
        const code: undefined | number = undefined;

        jest.spyOn(fetch, "useFetch").mockImplementation((url, method, cb) => {
            return {
                loading: true,
                load: ({email, password}: { email: string, password: string }) => {
                    submit({email, password});
                    cb && cb();
                },
                code,
                error: fetchError
            } as never
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
    });

    it('should render the login form with submit error', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const submit = jest.fn();
        let fetchError = "";
        let code: undefined | number = undefined;

        jest.spyOn(fetch, "useFetch").mockImplementation((url, method, cb) => {
            return {
                loading: false,
                load: ({email, password}: { email: string, password: string }) => {
                    submit({email, password});
                    cb && cb();
                },
                code,
                error: fetchError
            } as never
        });

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        const email = screen.getByLabelText(fr.login.email);
        const password = screen.getByLabelText(fr.login.password);
        const btn = screen.getByText(fr.login.connect) as HTMLButtonElement;

        fireEvent.change(email, {target: {value: "e"}});
        fireEvent.change(password, {target: {value: "e"}});

        // Force enable (html changes) to check canSubmit
        btn.disabled = false;

        fireEvent.click(btn);
        expect(screen.getByText(fr.login.error.fields)).toBeInTheDocument();

        fireEvent.change(email, {target: {value: "wrong_email"}});
        fireEvent.change(password, {target: {value: "password"}});
        fireEvent.click(btn);

        expect(screen.getByText(fr.login.error.email)).toBeInTheDocument();
        expect(btn).not.toHaveClass("hover:cursor-not-allowed");

        fireEvent.change(email, {target: {value: "vmairets@gmail.com"}});
        fireEvent.click(btn);

        code = 1;

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.httpErrors["1"])).toBeInTheDocument();

        code = undefined;
        fetchError = "fetching error...";

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fetchError)).toBeInTheDocument();
    });

    it('should login the user', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});
        const submit = jest.fn();

        const login = jest.spyOn(actions, "login").mockImplementation((data: IUser) => {
            return {
                type: LOGIN,
                payload: data
            }
        });

        jest.spyOn(fetch, "useFetch").mockImplementation((url, method, cb) => {
            return {
                loading: false,
                load: ({email, password}: { email: string, password: string }) => {
                    submit({email, password});
                    cb && cb(UserStub());
                },
                code: undefined,
                error: ""
            } as never
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LoginForm />
                </RouterContext.Provider>
            </Provider>
        )

        const email = screen.getByLabelText(fr.login.email);
        const password = screen.getByLabelText(fr.login.password);
        const btn = screen.getByText(fr.login.connect) as HTMLButtonElement;

        fireEvent.change(email, {target: {value: "vmairets@gmail.com"}});
        fireEvent.change(password, {target: {value: "password"}});
        fireEvent.click(btn);

        await waitFor(() => {
            expect(login).toHaveBeenCalled()
            expect(push).toHaveBeenCalledWith("/account");

        })
    });

});