import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import SecurityView from "../../../../../components/account/views/SecurityView";
import {UserStub} from "../../../../stub/UserStub";
import {queryByContent} from "../../../../utils/CustomQueries";
import * as fr from '../../../../../public/static/locales/fr.json'
import * as fetch from "../../../../../context/instance";

describe('Security View', function () {


    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the view', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("view-title").textContent).toBe(fr.account.security.title);
        expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
        expect(screen.getByLabelText(fr.account.security.password)).toBeInTheDocument();
        expect(screen.getByText(fr.account.security.delete.warning)).toBeInTheDocument();
    });

    it('should render the view loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView user={user} pending={true} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
    });

    it('should update the user password with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValueOnce({code: 17})
            .mockRejectedValueOnce({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )

        const passInput = screen.getByLabelText(fr.account.security.password) as HTMLInputElement;
        const cPassInput = screen.getByLabelText(fr.account.security.currentPassword) as HTMLInputElement;
        const submit = screen.getByText(fr.common.save);

        expect(cPassInput).toBeInTheDocument();
        expect(passInput).toBeInTheDocument();
        expect(submit).toBeInTheDocument();

        const password = "new_password";
        const currentPassword = "current_password"

        fireEvent.change(cPassInput, {target: {value: currentPassword}});
        fireEvent.click(submit);
        expect(screen.queryByText(fr.account.security.password)).toBeInTheDocument();

        fireEvent.change(passInput, {target: {value: password}});
        fireEvent.change(cPassInput, {target: {value: ""}});
        fireEvent.click(submit);
        expect(screen.queryByText(fr.account.security.currentPassword)).toBeInTheDocument();

        fireEvent.change(cPassInput, {target: {value: currentPassword}});
        fireEvent.click(submit);

        await waitFor(() => {
            expect(screen.queryByText(fr.httpErrors["17"])).toBeInTheDocument();
        })

        fireEvent.click(submit);

        await waitFor(() => {
            expect(screen.queryByText(fr.account.security.errors.rejectedPassword)).toBeInTheDocument();
        })

    });

    it('should update the user password', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValue({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )

        const passInput = screen.getByLabelText(fr.account.security.password) as HTMLInputElement;
        const cPassInput = screen.getByLabelText(fr.account.security.currentPassword) as HTMLInputElement;
        const submit = screen.getByText(fr.common.save);

        const password = "new_password";
        const currentPassword = "current_password"

        fireEvent.change(passInput, {target: {value: password}});
        fireEvent.change(cPassInput, {target: {value: currentPassword}});

        expect(passInput.value).toBe(password);
        expect(cPassInput.value).toBe(currentPassword);
        fireEvent.click(submit);

        await waitFor(() => {
            expect(screen.getByText(fr.account.security.success)).toBeInTheDocument();
            expect(passInput.value).toBe("");
            expect(cPassInput.value).toBe("");
        })
    });

    it('should delete user account with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValue({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )

        const deleteButton = screen.getByText(fr.account.security.delete.action);
        expect(deleteButton).toBeInTheDocument();
        act(() => {
            fireEvent.click(deleteButton);
        })
        await waitFor(() => {
            const confirm = screen.getByText(fr.common.delete);
            expect(confirm).toBeInTheDocument();

            act(() => {
                fireEvent.click(confirm);
            })
        })

        await waitFor(() => {
            expect(screen.queryByText(fr.common.delete)).not.toBeInTheDocument();
            expect(screen.getByText(fr.account.security.errors.deleteAccount)).toBeInTheDocument();
        })
    });

    it('should delete user account', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValue({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )

        const deleteButton = screen.getByText(fr.account.security.delete.action);

        act(() => {
            fireEvent.click(deleteButton);
        })

        await waitFor(() => {
            const confirm = screen.getByText(fr.common.delete);

            act(() => {
                fireEvent.click(confirm);
            })
        })

        await waitFor(() => {
            expect(screen.queryByText(fr.account.security.errors.deleteAccount)).not.toBeInTheDocument();
        })
    });

});

