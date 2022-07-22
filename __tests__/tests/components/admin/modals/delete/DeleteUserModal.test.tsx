import {makeStore} from "../../../../../../context/store";
import {MockUseRouter} from "../../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import * as fetch from "../../../../../../context/instance";
import {UserStub} from "../../../../../stub/UserStub";
import {getUser} from "../../../../../../context/actions/users/user.actions";
import DeleteUserModal from "../../../../../../components/admin/modals/delete/DeleteUserModal";
import fr from "../../../../../../public/static/locales/fr.json";
import {IUserRole} from "../../../../../../shared/types/user.type";

describe('DeleteUserModalTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the delete modal but without action if user is equal to the logged one', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValue({
            data: UserStub()
        });

        await store.dispatch(getUser());

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <DeleteUserModal isShowing={true} toggle={jest.fn()} user={UserStub()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.admin.users.cantDelete)).toBeInTheDocument();
        expect(screen.queryByText(fr.common.delete)).not.toBeInTheDocument();
    });

    it('should render the delete modal', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const fn = jest.fn();

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: UserStub()
        }).mockResolvedValueOnce({
            data: UserStub(IUserRole.USER, "01")
        });

        await store.dispatch(getUser());

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <DeleteUserModal isShowing={true} toggle={fn} user={UserStub(IUserRole.USER, "01")} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.queryByText(fr.admin.users.cantDelete)).not.toBeInTheDocument();
        expect(screen.getByText(fr.common.delete)).toBeInTheDocument();
        fireEvent.click(screen.getByText(fr.common.delete));

        await waitFor(() => {
            expect(fn).toHaveBeenCalled();
        })
    });


});