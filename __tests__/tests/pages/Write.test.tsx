import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Write from "../../../pages/write";
import * as hooks from '../../../context/hooks';
import {queryByContent} from "../../utils/CustomQueries";
import {UserStub} from "../../stub/UserStub";
import {IUserRole} from "../../../shared/types/user.type";
import fr from "../../../public/static/locales/fr.json";

describe('WriteTest', function () {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should not render the write page (unAuth)', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: {}})
            .mockReturnValueOnce({categories: []})
            .mockReturnValueOnce({categories: [], pending: false})
            .mockReturnValueOnce({pending: false})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Write />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("un-auth")).toBeInTheDocument();
    });

    it('should not render the write page (role)', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: UserStub(IUserRole.POSTER)})
            .mockReturnValueOnce({categories: []})
            .mockReturnValueOnce({categories: [], pending: false})
            .mockReturnValueOnce({pending: true})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Write />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
    });

    it('should render the write page loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: UserStub()})
            .mockReturnValueOnce({categories: []})
            .mockReturnValueOnce({categories: [], pending: false})
            .mockReturnValueOnce({pending: false})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Write />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("un-auth")).toBeInTheDocument();
    });

    it('should render the write page and handle errors #1', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: UserStub(IUserRole.POSTER)})
            .mockReturnValueOnce({categories: []})
            .mockReturnValueOnce({categories: [], pending: false})
            .mockReturnValueOnce({pending: false});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Write />
                </RouterContext.Provider>
            </Provider>
        )

        const submit = screen.getByText(fr.posts.create.action);
        expect(queryByContent("un-auth")).not.toBeDefined();
        expect(submit).toBeInTheDocument();

        // need to be refactored

    });

});