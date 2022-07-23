import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {makeStore} from "../../../../../context/store";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import ProfileView from "../../../../../components/account/views/ProfileView";
import {UserStub} from "../../../../stub/UserStub";
import * as fr from '../../../../../public/static/locales/fr.json'
import {queryByContent} from "../../../../utils/CustomQueries";
import * as fetch from "../../../../../context/instance";
import {IUser} from "../../../../../shared/types/user.type";

describe('Profile View', function () {


    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the profile view', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={UserStub()} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("view-title").textContent).toEqual(fr.account.profile.title);
        expect(screen.getByLabelText(fr.account.profile.pseudo)).toBeInTheDocument();
        const emailInput = screen.getByLabelText(fr.account.profile.email) as HTMLInputElement;
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toBeDisabled();

    });

    it('should render the profile view loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={UserStub()} pending={true} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();

    });

    it('should render update the user with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValueOnce({code: 6})
            .mockRejectedValueOnce({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )
        const input = screen.getByLabelText(fr.account.profile.pseudo) as HTMLInputElement;
        const submit = screen.getByText(fr.common.save) as HTMLButtonElement;
        const pseudo = user.pseudo;
        act(() => {
            fireEvent.change(input, {target: {value: pseudo}})
        })
        expect(input.value).toBe(pseudo);
        act(() => {
            fireEvent.click(submit);
        })
        expect(screen.queryByText(fr.account.profile.success.profile)).not.toBeInTheDocument();

        act(() => {
            fireEvent.change(input, {target: {value: "      "}})
        })
        act(() => {
            fireEvent.click(submit);
        })
        expect(screen.queryByText(fr.account.profile.errors.pseudo)).toBeInTheDocument();

        act(() => {
            fireEvent.change(input, {target: {value: "Nouveau pseudo"}})
        })
        act(() => {
            fireEvent.click(submit);
        })
        await waitFor(() => {
            expect(screen.queryByText(fr.httpErrors["6"])).toBeInTheDocument();
        })

        act(() => {
            fireEvent.click(submit);
        })
        await waitFor(() => {
            expect(screen.queryByText(fr.common.errorSub)).toBeInTheDocument();
        })

    });

    it('should render update the user', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValue({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )
        const input = screen.getByLabelText(fr.account.profile.pseudo) as HTMLInputElement;
        const submit = screen.getByText(fr.common.save) as HTMLButtonElement;
        const pseudo = "nouveau pseudo";
        act(() => {
            fireEvent.change(input, {target: {value: pseudo}})
        })
        expect(input.value).toBe(pseudo);
        act(() => {
            fireEvent.click(submit);
        })

        await waitFor(() => {
            expect(screen.queryByText(fr.account.profile.success.profile)).toBeInTheDocument();
        })

    });

    it('should render update the user profile picture with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValueOnce({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )
        const input = screen.getByLabelText(fr.account.profile.upload) as HTMLInputElement;

        act(() => {
            fireEvent.change(input, {target: {files: []}})
        })

        expect(screen.queryByText(fr.account.profile.success.upload)).not.toBeInTheDocument();

        act(() => {
            const file = new File([""], "mockImg.png");
            Object.defineProperty(file, 'size', {value: 1024 * 1024 + 1});
            fireEvent.change(input, {target: {files: [file]}})
        })

        expect(screen.getByText(fr.account.profile.errors.fileSize)).toBeInTheDocument();

        act(() => {
            const file = new File([""], "mockImg.png");
            fireEvent.change(input, {target: {files: [file]}})
        })

        await waitFor(() => {
            expect(screen.getByText(fr.account.profile.errors.fileError)).toBeInTheDocument();
        })

    });

    it('should render update the user profile picture', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValue({data: {picture: ""}})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )
        const input = screen.getByLabelText(fr.account.profile.upload) as HTMLInputElement;

        act(() => {
            const file = new File([""], "mockImg.png");
            fireEvent.change(input, {target: {files: [file]}})
        })

        await waitFor(() => {
            expect(screen.getByText(fr.account.profile.success.upload)).toBeInTheDocument();
        })

    });

    it('should render deleting the user profile picture with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const pictureUrl = "https://via.placeholder.com/150/92c952";
        const user = {
            ...UserStub(),
            picture: pictureUrl
        };

        jest.spyOn(fetch, "fetchApi")
            .mockRejectedValue({})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )

        const deleteButton = screen.getByText(fr.account.profile.delete) as HTMLButtonElement;
        await waitFor(() => {
            expect(
                (screen.getByAltText("profile picture") as HTMLImageElement).src
            ).toContain(encodeURIComponent(pictureUrl));
        })
        act(() => {
            fireEvent.click(deleteButton);
        })

        await waitFor(() => {
            expect(screen.getByText(fr.account.profile.errors.removeError)).toBeInTheDocument();
        });

        expect(
            (screen.getByAltText("profile picture") as HTMLImageElement).src
        ).toContain(encodeURIComponent(pictureUrl));
    });

    it('should render deleting the user profile picture', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const pictureUrl = "https://via.placeholder.com/150/92c952";
        let user: IUser = {
            ...UserStub(),
            picture: pictureUrl
        };
        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValue({})

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )

        const deleteButton = screen.getByText(fr.account.profile.delete);

        await waitFor(() => {
            expect(
                (screen.getByAltText("profile picture") as HTMLImageElement).src
            ).toContain(encodeURIComponent(pictureUrl));
        })

        act(() => {
            fireEvent.click(deleteButton);
        })

        await waitFor(() => {
            expect(screen.getByText(fr.account.profile.success.deletion)).toBeInTheDocument();
        })

        user = UserStub();

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView user={user} pending={false} />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(
                (screen.getByAltText("profile picture") as HTMLImageElement).src
            ).not.toContain(encodeURIComponent(pictureUrl));
        })
    });

});