import {makeStore} from "../../../../../../context/store";
import {MockUseRouter} from "../../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {CategoryStub} from "../../../../../stub/CategoryStub";
import * as fetch from "../../../../../../context/instance";
import {PostStub} from "../../../../../stub/PostStub";
import CategoriesView from "../../../../../../components/admin/views/CategoriesView";
import fr from "../../../../../../public/static/locales/fr.json";
import {queryByContent} from "../../../../../utils/CustomQueries";

describe('CategoryDetailsModalTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the category details modal and navigate to a post', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: [{...CategoryStub(), count: 1}]
        }).mockResolvedValueOnce({
            data: [PostStub()]
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <CategoriesView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(CategoryStub().name)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(CategoryStub().name));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.details)).toBeInTheDocument();
        })

        fireEvent.click(screen.getAllByRole("listitem")[1]);

        expect(screen.getByText(PostStub().title)).toBeInTheDocument();

        fireEvent.click(screen.getByText(PostStub().title));

        await waitFor(() => {
            expect(queryByContent("post-details-content")).toBeInTheDocument();
        })
    });


});