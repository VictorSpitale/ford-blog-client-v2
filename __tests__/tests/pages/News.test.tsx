import {render, screen, waitFor} from "@testing-library/react";
import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import News from "../../../pages/news";
import * as fetch from "../../../context/instance";
import * as fr from "../../../public/static/locales/fr.json";
import {UserStub} from "../../stub/UserStub";
import {getUser} from "../../../context/actions/user.actions";
import {PostStub} from "../../stub/PostStub";
import * as hooks from "../../../context/hooks";

describe('NewsTest', function () {

    const observe = jest.fn();
    const disconnect = jest.fn();

    beforeEach(() => {
        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe,
            unobserve: () => null,
            disconnect
        });
        window.IntersectionObserver = mockIntersectionObserver;
    })

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    it('should render the news page unAuth', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: UserStub()
        })

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <News />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.posts.news.cantAccess)).toBeInTheDocument();
        expect(spy).not.toHaveBeenCalled();
    });


    it('should render the news page', async function () {

        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: UserStub()
        }).mockResolvedValueOnce({
            data: {hasMore: false, posts: Array(15).fill(1).map((_, i) => PostStub(`id-${i}`)), page: 1}
        })

        await store.dispatch(getUser());

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <News />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.queryByText(fr.posts.news.cantAccess)).not.toBeInTheDocument();
            expect(screen.getAllByText(PostStub().title).length).toBe(15);
        })

    });

    it('should render the news page loading', async function () {

        const store = makeStore();
        const router = MockUseRouter({});
        const paginatedPosts = {
            hasMore: false,
            posts: Array(15).fill(1).map((_, i) => PostStub(`id-${i}`)),
            page: 1
        };

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: UserStub()})
            .mockReturnValueOnce({
                paginatedPosts,
                pending: true
            })

        jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: paginatedPosts})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <News />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.queryByText(fr.posts.news.cantAccess)).not.toBeInTheDocument();
            expect(screen.getAllByText(PostStub().title).length).toBe(15);
            expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
        })

    });


});