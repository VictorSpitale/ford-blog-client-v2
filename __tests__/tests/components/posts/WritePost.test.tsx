import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import WritePost from "../../../../components/posts/WritePost";
import {queryByContent} from "../../../utils/CustomQueries";
import * as fr from "../../../../public/static/locales/fr.json";
import {ICategory} from "../../../../shared/types/category.type";
import {CategoryStub} from "../../../stub/CategoryStub";
import * as fetch from "../../../../context/instance";
import {PostStub} from "../../../stub/PostStub";

describe('WritePostTest', function () {

    let selectedCategories: ICategory[];
    let categories: ICategory[];
    let categoriesPending: boolean;
    let pending: boolean;

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    beforeEach(() => {
        pending = false;
        categoriesPending = false;
        selectedCategories = [];
        categories = [];
    })

    it('should render the form', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <WritePost categoriesPending={categoriesPending}
                               pending={pending} selectedCategories={selectedCategories} categories={categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("write-form")).toBeInTheDocument();

    });

    it('should render the form loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        pending = true;

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <WritePost categoriesPending={categoriesPending}
                               pending={pending} selectedCategories={selectedCategories} categories={categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();

    });

    it('should render the form with fields errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        window.URL.createObjectURL = jest.fn();

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValueOnce({code: 10})
            .mockRejectedValueOnce({})

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <WritePost categoriesPending={categoriesPending}
                               pending={pending} selectedCategories={selectedCategories} categories={categories} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.click(screen.getByText(fr.posts.create.action));
        await waitFor(() => {
            expect(screen.getByText(fr.posts.create.errors.key.replace('{{key}}', fr.posts.create.fields.desc))).toBeInTheDocument();
        })

        fireEvent.change(queryByContent("desc"), {target: {value: "desc"}});
        fireEvent.change(queryByContent("title"), {target: {value: "title"}});
        fireEvent.change(queryByContent("sourceName"), {target: {value: "source"}});
        fireEvent.change(queryByContent("sourceLink"), {target: {value: "site"}});

        const file = new File([""], "mockImg.png");
        fireEvent.change(screen.getByLabelText(fr.posts.create.photo), {target: {files: [file]}});

        fireEvent.click(screen.getByText(fr.posts.create.action));

        await waitFor(() => {
            expect(screen.getByText(fr.posts.create.errors.categories)).toBeInTheDocument();
        })

        selectedCategories = [CategoryStub()];

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <WritePost categoriesPending={categoriesPending}
                               pending={pending} selectedCategories={selectedCategories} categories={categories} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.change(queryByContent("desc"), {target: {value: "desc"}});
        fireEvent.change(queryByContent("title"), {target: {value: "title"}});
        fireEvent.change(queryByContent("sourceLink"), {target: {value: "site"}});
        fireEvent.change(queryByContent("sourceName"), {target: {value: "source"}});

        fireEvent.click(screen.getByText(fr.posts.create.action));

        await waitFor(() => {
            expect(screen.getByText(fr.posts.create.errors.sourceLink)).toBeInTheDocument();
        })

        fireEvent.change(queryByContent("sourceLink"), {target: {value: "https://site.fr"}});
        fireEvent.change(screen.getByLabelText(fr.posts.create.photo), {target: {files: []}});

        fireEvent.click(screen.getByText(fr.posts.create.action));

        await waitFor(() => {
            expect(screen.getByText(fr.httpErrors["10"])).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.posts.create.action));
        await waitFor(() => {
            expect(screen.getByText(fr.common.errorSub)).toBeInTheDocument();
        })

    });

    it('should create a post', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValueOnce({data: PostStub()})
        selectedCategories = [CategoryStub()];

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <WritePost categoriesPending={categoriesPending}
                               pending={pending} selectedCategories={selectedCategories} categories={categories} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.change(queryByContent("desc"), {target: {value: "desc"}});
        fireEvent.change(queryByContent("title"), {target: {value: "title"}});
        fireEvent.change(queryByContent("sourceName"), {target: {value: "source"}});
        fireEvent.change(queryByContent("sourceLink"), {target: {value: "https://site.fr"}});
        fireEvent.click(screen.getByText(fr.posts.create.action));

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith(`/post/title`);
        })

    });

});