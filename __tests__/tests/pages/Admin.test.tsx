import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Admin from "../../../pages/admin";
import {queryByContent} from "../../utils/CustomQueries";
import * as hooks from "../../../context/hooks";
import {UserStub} from "../../stub/UserStub";
import {IUserRole} from "../../../shared/types/user.type";
import fr from "../../../public/static/locales/fr.json";
import * as fetch from "../../../context/instance";
import {getUser} from "../../../context/actions/users/user.actions";

describe('AdminTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should not render the admin page if the user is not admin', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector").mockReturnValueOnce({
            user: UserStub()
        })

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Admin />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("admin-view")).not.toBeDefined();
    });

    it('should not render the admin page if unAuth', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Admin />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("admin-view")).not.toBeDefined();
    });

    it('should render the admin page', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector").mockReturnValueOnce({
            user: UserStub(IUserRole.ADMIN)
        })

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Admin />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("admin-view")).toBeInTheDocument();
        expect(screen.getByText(fr.admin.posts.title)).toBeInTheDocument();

    });

    it('should render the admin page with users view', async function () {
        const store = makeStore();
        const router = MockUseRouter({query: {view: "users"}});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: UserStub(IUserRole.ADMIN)
        });

        await store.dispatch(getUser());

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Admin />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("admin-view")).toBeInTheDocument();
        expect(screen.getByText(fr.admin.users.title)).toBeInTheDocument();

    });


});