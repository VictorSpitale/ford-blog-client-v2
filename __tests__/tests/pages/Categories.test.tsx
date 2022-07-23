import '../../mocks/matchMedia';
import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Categories from "../../../pages/categories";
import * as hooks from "../../../context/hooks";
import * as fr from "../../../public/static/locales/fr.json";
import {PostStub} from "../../stub/PostStub";
import {CategoryStub} from "../../stub/CategoryStub";
import {queryByContent} from "../../utils/CustomQueries";
import {MatchPush} from "../../utils/MatchPush";

describe('CategoriesTest', function () {

    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should render the categories page with no post', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Categories />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.categories.noCat)).toBeInTheDocument();
        expect(screen.getByText(fr.categories.noPost)).toBeInTheDocument();

    });

    it('should render the categories page loading', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({
                posts: [], pending: true
            })
            .mockReturnValueOnce({category: CategoryStub().name})
            .mockReturnValueOnce({categories: []})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Categories />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();

    });

    it('should render the categories page with posts', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({
                posts: [{
                    category: CategoryStub(),
                    posts: [{...PostStub(), categories: [CategoryStub()]}]
                }], pending: false
            })
            .mockReturnValueOnce({category: CategoryStub()})
            .mockReturnValueOnce({categories: [CategoryStub()]})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Categories />
                </RouterContext.Provider>
            </Provider>
        )
        await waitFor(() => {

            expect(screen.queryByText(fr.categories.noCat)).not.toBeInTheDocument();
            expect(screen.queryByText(fr.categories.noPost)).not.toBeInTheDocument();

            expect(screen.getByText(PostStub().title)).toBeInTheDocument();
            expect(queryByContent(`category-slide-${CategoryStub().name}`)).toBeInTheDocument();

        })
    });

    it('should switch category', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push, query: {selected: "suv"}});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({
                posts: [{
                    category: "sport",
                    posts: [{...PostStub(), categories: [CategoryStub()]}]
                }], pending: false
            })
            .mockReturnValueOnce({category: undefined})
            .mockReturnValueOnce({categories: [CategoryStub(), CategoryStub("suv", "00")]})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Categories />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.categories.noPost)).toBeInTheDocument();

        expect(queryByContent(`category-slide-${CategoryStub("suv", "00").name}`)).toBeInTheDocument();
        expect(queryByContent(`category-slide-${CategoryStub("sport").name}`)).toBeInTheDocument();

        fireEvent.click(queryByContent(`category-slide-${CategoryStub("sport").name}`));

        await waitFor(() => {
            MatchPush(router, `/categories?selected=${CategoryStub("sport").name}`)
        })
    });


});