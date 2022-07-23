import {makeStore} from "../../../../../../context/store";
import {MockUseRouter} from "../../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import UpdateCategoryModal from "../../../../../../components/admin/modals/update/UpdateCategoryModal";
import {CategoryStub} from "../../../../../stub/CategoryStub";
import * as hooks from "../../../../../../context/hooks";
import fr from "../../../../../../public/static/locales/fr.json";
import * as fetch from "../../../../../../context/instance";
import {queryByContent} from "../../../../../utils/CustomQueries";
import {HttpErrorStub} from "../../../../../stub/HttpErrorStub";

describe('UpdateCategoryModalTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the modal loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(hooks, "useAppSelector").mockReturnValueOnce({
            pending: true
        })

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateCategoryModal isShowing={true} toggle={jest.fn()} category={CategoryStub()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
    });

    it('should render the modal with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValueOnce({...HttpErrorStub(), code: 12})
            .mockRejectedValueOnce({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateCategoryModal isShowing={true} toggle={jest.fn()} category={CategoryStub()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("category")).toBeInTheDocument();
        fireEvent.change(queryByContent("category"), {target: {value: "   "}});
        fireEvent.click(screen.getByText(fr.common.update));
        expect(screen.getByText(fr.admin.categories.fields.error)).toBeInTheDocument();


        fireEvent.change(queryByContent("category"), {target: {value: "sport"}});
        fireEvent.click(screen.getByText(fr.common.update));

        await waitFor(() => {
            expect(screen.getByText(fr.httpErrors["12"])).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.update));

        await waitFor(() => {
            expect(screen.getByText(fr.common.errorSub)).toBeInTheDocument();
        })
    });

    it('should update the category', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const fn = jest.fn();

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValueOnce({data: CategoryStub()})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateCategoryModal isShowing={true} toggle={fn} category={CategoryStub()} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.change(queryByContent("category"), {target: {value: "sport"}});
        fireEvent.click(screen.getByText(fr.common.update));

        await waitFor(() => {
            expect(fn).toHaveBeenCalled();
        })
    });


});