import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import CategoriesSelector from "../../../../components/categories/CategoriesSelector";
import * as fr from "../../../../public/static/locales/fr.json";
import {CategoryStub} from "../../../stub/CategoryStub";
import {queryByContent} from "../../../utils/CustomQueries";
import selectEvent from "react-select-event";
import * as action from "../../../../context/actions/categories/categories.actions";
import * as fetch from "../../../../context/instance";

describe('CategoriesSelectorTest', function () {

    it('should render the selector', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[]} defaultCategories={[]}
                                        selectedCategories={[]} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.categories.selectorPlaceholder)).toBeInTheDocument();

    });

    it('should render the defaults categories', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const category = CategoryStub();
        const second = CategoryStub("suv", "11")

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[category, second]} defaultCategories={[category]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        waitFor(() => {
            expect(screen.getByText(category.name)).toBeInTheDocument();
        })

    });

    it('should render multiple categories and select two then remove the first', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const category = CategoryStub("sport", "97");
        const second = CategoryStub("suv", "98")

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[category, second]} defaultCategories={[]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("categories-selector")).toBeInTheDocument();
        expect(queryByContent("categories-selector")).toHaveFormValues({"categories-selector": ""})

        await selectEvent.select(screen.getByLabelText("categories-selector"), [category.name, second.name]);

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[category, second]} defaultCategories={[]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("categories-selector")).toHaveFormValues({"categories-selector": [category.name, second.name]})

        await selectEvent.clearFirst(screen.getByLabelText("categories-selector"));

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[category, second]} defaultCategories={[]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("categories-selector")).toHaveFormValues({"categories-selector": second.name})

    });

    it('should create a category', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const spy = jest.spyOn(action, "createCategory");
        const newCat = CategoryStub("test", "00");
        const newCatName = newCat.name;
        const fetchSpy = jest.spyOn(fetch, "fetchApi");
        fetchSpy.mockResolvedValueOnce({data: {...newCat}});

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[]} defaultCategories={[]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("categories-selector")).toHaveFormValues({"categories-selector": ""})

        await selectEvent.create(screen.getByLabelText("categories-selector"), newCatName, {waitForElement: false});

        expect(spy).toHaveBeenCalledWith(newCatName);

        expect(fetchSpy).toHaveBeenCalled();

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[newCat]} defaultCategories={[]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        await selectEvent.select(screen.getByLabelText("categories-selector"), [newCat.name]);

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[newCat]} defaultCategories={[]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("categories-selector")).toHaveFormValues({"categories-selector": newCat.name})
    });

    it('should reject create a category', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const fetchSpy = jest.spyOn(fetch, "fetchApi");
        const spy = jest.spyOn(action, "createCategory");
        const newCat = CategoryStub("test", "00");
        const newCatName = newCat.name;
        fetchSpy.mockRejectedValueOnce({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSelector pending={false} categories={[]} defaultCategories={[]}
                                        selectedCategories={store.getState().selectCategories.categories} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("categories-selector")).toHaveFormValues({"categories-selector": ""})

        await selectEvent.create(screen.getByLabelText("categories-selector"), newCatName, {waitForElement: false});

        expect(spy).toHaveBeenCalledWith(newCatName);

        expect(fetchSpy).toHaveBeenCalled();
    });

});