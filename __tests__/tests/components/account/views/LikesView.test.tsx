import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import LikesView from "../../../../../components/account/views/LikesView";
import {queryByContent} from "../../../../utils/CustomQueries";
import * as fr from '../../../../../public/static/locales/fr.json';
import {UserStub} from "../../../../stub/UserStub";
import * as hooks from '../../../../../context/hooks'
import * as fetch from '../../../../../context/instance'
import {BasicPostStub} from "../../../../stub/PostStub";
import {makeStore} from "../../../../../context/store";
import {Provider} from "react-redux";

describe('Likes View', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the likes view', function () {

        const router = MockUseRouter({});
        const user = UserStub();
        const store = makeStore();

        jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: []})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LikesView user={user} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("view-title")).toBeInTheDocument();

    });

    it('should render the likes view pending', function () {

        const router = MockUseRouter({});
        const user = UserStub();
        const store = makeStore();
        jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: []})

        jest.spyOn(hooks, "useAppSelector").mockReturnValue({
            posts: [],
            pending: true
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LikesView user={user} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.queryByText(fr.common.loading)).toBeInTheDocument();

    });

    it('should render a liked post', function () {

        const router = MockUseRouter({});
        const user = UserStub();
        const store = makeStore();
        const basicPost = BasicPostStub();
        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: []})

        jest.spyOn(hooks, "useAppSelector").mockReturnValue({
            posts: [basicPost],
            pending: false
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <LikesView user={user} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.queryByText(basicPost.title)).toBeInTheDocument();

    });

});