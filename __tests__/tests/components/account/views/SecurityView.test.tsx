import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import SecurityView from "../../../../../components/account/views/SecurityView";
import {UserStub} from "../../../../stub/UserStub";
import {queryByContent} from "../../../../utils/CustomQueries";
import * as fr from '../../../../../public/static/locales/fr.json'

describe('Security View', function () {

    it('should render the view', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView authUser={{user, pending: false}} security={{} as never} />
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
                    <SecurityView authUser={{user, pending: true}} security={{} as never} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
    });

    it('should update the user password', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();
        const update = jest.fn();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView authUser={{user, pending: false}} security={{changePassword: update} as never} />
                </RouterContext.Provider>
            </Provider>
        )
        const passInput = screen.getByLabelText(fr.account.security.password) as HTMLInputElement;
        const cPassInput = screen.getByLabelText(fr.account.security.currentPassword) as HTMLInputElement;
        const submit = screen.getByText(fr.common.save);
        expect(passInput).toBeInTheDocument();
        expect(submit).toBeInTheDocument();
        const password = "new_password";
        const currentPassword = "current_password"
        act(() => {
            fireEvent.change(passInput, {target: {value: password}});
            fireEvent.change(cPassInput, {target: {value: currentPassword}});
        })
        expect(passInput.value).toBe(password);
        expect(cPassInput.value).toBe(currentPassword);
        act(() => {
            fireEvent.click(submit);
            expect(update).toHaveBeenCalledWith(expect.any(Function), {current: cPassInput}, {current: passInput});
        })
    });

    it('should delete user account', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();
        const update = jest.fn().mockResolvedValue({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SecurityView authUser={{user, pending: false}} security={{deleteAccount: update} as never} />
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
            expect(update).toHaveBeenCalled();
            expect(screen.queryByText(fr.common.delete)).not.toBeInTheDocument();
        })
    });

});

