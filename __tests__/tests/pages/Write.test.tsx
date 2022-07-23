import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Write from "../../../pages/write";
import * as fr from "../../../public/static/locales/fr.json";
import * as hooks from "../../../context/hooks";
import {UserStub} from "../../stub/UserStub";
import {IUserRole} from "../../../shared/types/user.type";
import {queryByContent} from "../../utils/CustomQueries";

describe('WriteTest', function () {

    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should block access on auAuth', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Write />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.posts.create.cantAccess)).toBeInTheDocument();
    });

    it('should block access on insufficient role', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: UserStub()})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Write />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.posts.create.cantAccess)).toBeInTheDocument();
    });

    it('should render the write page', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: UserStub(IUserRole.ADMIN)})
            .mockReturnValueOnce({categories: []})
            .mockReturnValueOnce({categories: [], pending: false})
            .mockReturnValueOnce({pending: false})
            .mockReturnValueOnce({writePageError: ""});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Write />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("write-form")).toBeInTheDocument();
    });


});