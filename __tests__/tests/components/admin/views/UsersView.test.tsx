import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import * as fetch from "../../../../../context/instance";
import UsersView from "../../../../../components/admin/views/UsersView";
import fr from "../../../../../public/static/locales/fr.json";
import {UserStub} from "../../../../stub/UserStub";

describe('UsersViewTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the users view', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [UserStub()]});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UsersView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(UserStub().pseudo)).toBeInTheDocument();
        })
    });

    it('should render the users view and open details', async function () {
        const router = MockUseRouter({});
        const store = makeStore();

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [UserStub()]});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UsersView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(UserStub().pseudo)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(UserStub().pseudo));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.details)).toBeInTheDocument();
        })
    });

    it('should render the users view and open update', async function () {
        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [UserStub()]});
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UsersView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(UserStub().pseudo)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.update));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.users.updateTitle)).toBeInTheDocument();
        })
    });

    it('should render the users view and open delete', async function () {
        const store = makeStore();
        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [UserStub()]});
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UsersView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(UserStub().pseudo)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.delete));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.users.delete.replace('{{name}}', UserStub().pseudo))).toBeInTheDocument();
        })
    });

});