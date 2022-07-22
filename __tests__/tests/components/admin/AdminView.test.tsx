import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import AdminView from "../../../../components/admin/AdminView";
import fr from "../../../../public/static/locales/fr.json";
import {queryByContent} from "../../../utils/CustomQueries";

describe('AdminViewTest', function () {

    it('should render the default admin view then switch', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <AdminView view={store.getState().adminView.view} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.admin.posts.title)).toBeInTheDocument();
        fireEvent.click(queryByContent("button-posts"));

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <AdminView view={store.getState().adminView.view} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.admin.posts.title)).toBeInTheDocument();
        fireEvent.click(queryByContent("button-users"));

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <AdminView view={store.getState().adminView.view} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.admin.users.title)).toBeInTheDocument();

    });


});