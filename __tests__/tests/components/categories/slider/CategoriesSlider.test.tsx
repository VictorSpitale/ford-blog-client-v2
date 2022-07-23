import '../../../../mocks/matchMedia';
import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import CategoriesSlider from "../../../../../components/categories/slider/CategoriesSlider";
import * as fr from "../../../../../public/static/locales/fr.json";
import {CategoryStub} from "../../../../stub/CategoryStub";
import {setCategorySlide} from "../../../../../context/actions/categories/categories.actions";
import {queryByContent} from "../../../../utils/CustomQueries";

describe('Categories Slider', function () {

    it('should render the empty slider', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSlider categories={[]} category={undefined} handleCategoryChange={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.categories.noCat)).toBeInTheDocument();
    });

    it('should render active category and a not active category', function () {
        const store = makeStore();
        const category = CategoryStub("sport", "96");
        const notActiveCategory = CategoryStub("suv", "97");
        const router = MockUseRouter({query: {selected: category.name}});
        const update = jest.fn().mockImplementation(() => store.dispatch(setCategorySlide({category})));

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesSlider categories={[category, notActiveCategory]} category={category}
                                      handleCategoryChange={update} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(update).toHaveBeenCalled();
        expect(store.getState().categorySlide.category).toBe(category);

        const activeSlide = queryByContent(`category-slide-${category.name}`);
        expect(activeSlide).toBeInTheDocument();
        expect(activeSlide).toHaveClass("bg-secondary-300");

        const notActiveSlide = queryByContent(`category-slide-${notActiveCategory.name}`);
        expect(notActiveSlide).toBeInTheDocument();
        expect(notActiveSlide).toHaveClass("bg-secondary-200");
    });


});