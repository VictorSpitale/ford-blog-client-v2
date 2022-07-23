import {makeStore} from "../../../../../../context/store";
import {MockUseRouter} from "../../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import UpdateUserModal from "../../../../../../components/admin/modals/update/UpdateUserModal";
import {UserStub} from "../../../../../stub/UserStub";
import * as fetch from "../../../../../../context/instance";
import * as actions from "../../../../../../context/actions/users/user.actions";
import {getUser} from "../../../../../../context/actions/users/user.actions";
import fr from "../../../../../../public/static/locales/fr.json";
import {queryByContent} from "../../../../../utils/CustomQueries";
import selectEvent from "react-select-event";
import {HttpErrorStub} from "../../../../../stub/HttpErrorStub";

describe('UpdateUserModalTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the update user modal', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateUserModal isShowing={true} toggle={jest.fn()} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByDisplayValue(user.pseudo)).toBeInTheDocument();
        expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
        expect((screen.getByDisplayValue(user.email) as HTMLInputElement).disabled).toBe(true);
    });

    it('should not update user if the logged user is the same', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: user
        });

        await store.dispatch(getUser());

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateUserModal isShowing={true} toggle={jest.fn()} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.click(screen.getByText(fr.common.confirm));
        expect(screen.getByText(fr.admin.users.cantUpdate)).toBeInTheDocument();
    });

    it('should reject the remove picture', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const link = "https://via.placeholder.com/150/92c952";
        const user = {...UserStub(), picture: link};

        jest.spyOn(fetch, "fetchApi").mockRejectedValueOnce({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateUserModal isShowing={true} toggle={jest.fn()} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect((screen.getByAltText(`${user.pseudo} profile picture`) as HTMLImageElement).src).toContain(encodeURIComponent(link));
            expect(screen.getByText(fr.admin.users.deletePicture)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.admin.users.deletePicture));

        await waitFor(() => {
            expect(screen.getByText(fr.account.profile.errors.removeError)).toBeInTheDocument();
        })
    });

    it('should remove the user picture', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const link = "https://via.placeholder.com/150/92c952";
        const user = {...UserStub(), picture: link};

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateUserModal isShowing={true} toggle={jest.fn()} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect((screen.getByAltText(`${user.pseudo} profile picture`) as HTMLImageElement).src).toContain(encodeURIComponent(link));
        })
        fireEvent.click(screen.getByText(fr.admin.users.deletePicture));
        await waitFor(() => {
            expect((screen.getByAltText(`${user.pseudo} profile picture`) as HTMLImageElement).src)
                .toContain(encodeURIComponent("/public/static/img/search_background-3.jpg")); // src === mocked img
        })
    });

    it('should render the modal with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();
        const fn = jest.fn();

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValueOnce({...HttpErrorStub(), code: 6})
            .mockRejectedValueOnce({})

        const updateSpy = jest.spyOn(actions, "updateUser");

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateUserModal isShowing={true} toggle={fn} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.click(screen.getByText(fr.common.confirm));
        expect(fn).not.toHaveBeenCalled();

        fireEvent.change(queryByContent("pseudo"), {target: {value: "   "}});
        fireEvent.click(screen.getByText(fr.common.confirm));
        expect(screen.getByText(fr.account.profile.errors.pseudo)).toBeInTheDocument();

        fireEvent.change(queryByContent("pseudo"), {target: {value: "ee"}});
        fireEvent.click(screen.getByText(fr.common.confirm));
        expect(screen.getByText(fr.account.profile.errors.pseudo)).toBeInTheDocument();

        fireEvent.change(queryByContent("pseudo"), {target: {value: "eeeeeeeeeeeeeeeeeeeeeeeeee"}});
        fireEvent.click(screen.getByText(fr.common.confirm));
        expect(screen.getByText(fr.account.profile.errors.pseudo)).toBeInTheDocument();

        fireEvent.change(queryByContent("pseudo"), {target: {value: "nouveau"}});
        await selectEvent.select(screen.getByLabelText(fr.account.profile.role), ["Administrateur"]);
        fireEvent.click(screen.getByText(fr.common.confirm));

        await waitFor(() => {
            expect(updateSpy).toHaveBeenCalledWith({pseudo: "nouveau", role: "2", _id: UserStub()._id});
            expect(screen.getByText(fr.httpErrors["6"])).toBeInTheDocument();
        })
        fireEvent.click(screen.getByText(fr.common.confirm));

        await waitFor(() => {
            expect(screen.getByText(fr.common.errorSub)).toBeInTheDocument();
        })
    });

    it('should update the user', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();
        const fn = jest.fn();

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValueOnce({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdateUserModal isShowing={true} toggle={fn} user={user} />
                </RouterContext.Provider>
            </Provider>
        )


        fireEvent.change(queryByContent("pseudo"), {target: {value: "nouveau"}});
        fireEvent.click(screen.getByText(fr.common.confirm));

        await waitFor(() => {
            expect(fn).toHaveBeenCalled();
        })
    });


});