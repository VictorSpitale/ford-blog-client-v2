import {act, fireEvent, render} from "@testing-library/react";
import AccountViewSwitcher from "../../../../components/account/AccountViewSwitcher";
import {AccountViews, getViewType} from "../../../../shared/types/accountViews.type";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {makeStore} from "../../../../context/store";
import {queryByContent} from "../../../utils/CustomQueries";

describe('Account View Switcher', function () {

    it('should render the switcher', function () {

        const router = MockUseRouter({});

        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <AccountViewSwitcher activeView={AccountViews.PROFILE} handleLogout={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )
        for (const key of Object.keys(AccountViews)) {
            const view = getViewType(key.toLowerCase());
            expect(queryByContent(`button-${view}`)).toBeInTheDocument();
        }
        expect(queryByContent('buttons')).toBeInTheDocument();

    });

    it('should not change view', function () {

        const router = MockUseRouter({});

        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <AccountViewSwitcher activeView={AccountViews.PROFILE} handleLogout={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        const profileButton = queryByContent('button-profile');

        expect(profileButton).toBeInTheDocument();
        expect(profileButton.classList.contains("bg-primary-100")).toBe(true);
        fireEvent.click(profileButton);
        expect(profileButton.classList.contains("bg-primary-100")).toBe(true);

    });

    it('should change view', async function () {

        const router = MockUseRouter({});
        const store = makeStore();

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <AccountViewSwitcher activeView={store.getState().accountView.view} handleLogout={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        const likesButton = queryByContent('button-likes');

        expect(likesButton).toBeInTheDocument();
        expect(likesButton.classList.contains("bg-primary-100")).not.toBe(true);
        act(() => {
            fireEvent.click(likesButton);
        })

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <AccountViewSwitcher activeView={store.getState().accountView.view} handleLogout={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent('button-likes').classList.contains("bg-primary-100")).toBe(true);

    });

    it('should logout', function () {

        const router = MockUseRouter({});
        const logout = jest.fn();

        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <AccountViewSwitcher activeView={AccountViews.PROFILE} handleLogout={logout} />
                </RouterContext.Provider>
            </Provider>
        )

        const logoutButton = queryByContent('button-logout');

        expect(logoutButton).toBeInTheDocument();
        fireEvent.click(logoutButton);
        expect(logout).toHaveBeenCalled();

    });


});