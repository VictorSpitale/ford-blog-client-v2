import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import * as fetch from "../../../../../context/instance";
import {CategoryStub} from "../../../../stub/CategoryStub";
import CategoriesView from "../../../../../components/admin/views/CategoriesView";
import fr from "../../../../../public/static/locales/fr.json";

describe('CategoriesViewTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the categories view', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [{...CategoryStub(), count: 1}]});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(CategoryStub().name)).toBeInTheDocument();
        })
    });

    it('should render the categories view and open details', async function () {
        const router = MockUseRouter({});
        const store = makeStore();

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [{...CategoryStub(), count: 1}]});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(CategoryStub().name)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(CategoryStub().name));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.details)).toBeInTheDocument();
        })
    });

    it('should render the categories view and open update', async function () {
        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [{...CategoryStub(), count: 1}]});
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(CategoryStub().name)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.update));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.categories.updateTitle)).toBeInTheDocument();
        })
    });

    it('should render the categories view and open delete', async function () {
        const store = makeStore();
        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: [{...CategoryStub(), count: 1}]});
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(CategoryStub().name)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.delete));

        await waitFor(() => {
            expect(screen.getByText(fr.categories.delete.replace('{{name}}', CategoryStub().name))).toBeInTheDocument();
        })
    });

});