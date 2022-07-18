import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Account from "../../../pages/account";
import * as fetch from "../../../context/instance";
import * as hooks from "../../../context/hooks";
import {UserStub} from "../../stub/UserStub";
import {getUser} from "../../../context/actions/users/user.actions";
import * as fr from "../../../public/static/locales/fr.json";
import {AccountViews} from "../../../shared/types/accountViews.type";

describe('AccountTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the account page', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValue({
            data: UserStub()
        })

        await store.dispatch(getUser());

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Account />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.account.title)).toBeInTheDocument();

    });

    it('should render the login page if unAuth', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Account />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.login.connect)).toBeInTheDocument();

    });

    it('should redirect on google auth', async function () {
        const store = makeStore();
        const router = MockUseRouter({query: {token: "token"}});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: UserStub()
        }).mockResolvedValueOnce({})

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({view: AccountViews.SECURITY})
            .mockReturnValueOnce({user: UserStub(), pending: false})

        await store.dispatch(getUser());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete window.location;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location = {};
        const setHrefSpy = jest.fn();
        Object.defineProperty(window.location, 'href', {
            set: setHrefSpy,
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Account />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(setHrefSpy).toHaveBeenCalledWith("/account");
        })

    });

    it('should redirect with errors on rejected google auth', async function () {
        const store = makeStore();
        const router = MockUseRouter({query: {token: "token"}});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({view: AccountViews.SECURITY})
            .mockReturnValueOnce({user: UserStub(), pending: false})

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: UserStub()
        }).mockRejectedValueOnce({})

        await store.dispatch(getUser());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete window.location;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location = {};
        const setHrefSpy = jest.fn();
        Object.defineProperty(window.location, 'href', {
            set: setHrefSpy,
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Account />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(setHrefSpy).toHaveBeenCalledWith("/login?status=failed");
        })

    });


});