import {makeStore} from "../../../../../../context/store";
import {MockUseRouter} from "../../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import DeleteCategoryModal from "../../../../../../components/admin/modals/delete/DeleteCategoryModal";
import {CategoryStub} from "../../../../../stub/CategoryStub";
import * as fetch from "../../../../../../context/instance";
import fr from "../../../../../../public/static/locales/fr.json";

describe('DeleteCategoryModalTest', function () {
    
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the delete modal', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const fn = jest.fn();

        jest.spyOn(fetch, "fetchApi").mockResolvedValue({
            data: CategoryStub()
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <DeleteCategoryModal isShowing={true} toggle={fn} category={CategoryStub()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.categories.delete.replace('{{name}}', CategoryStub().name))).toBeInTheDocument();
        fireEvent.click(screen.getByText(fr.common.delete));
        await waitFor(() => {
            expect(fn).toHaveBeenCalled();
        })
    });


});