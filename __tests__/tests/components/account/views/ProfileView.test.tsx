import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {makeStore} from "../../../../../context/store";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import ProfileView from "../../../../../components/account/views/ProfileView";
import {UserStub} from "../../../../stub/UserStub";
import * as fr from '../../../../../public/static/locales/fr.json'
import {queryByContent} from "../../../../utils/CustomQueries";

describe('Profile View', function () {

    it('should render the profile view', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView authUser={{user: UserStub(), pending: false}} profile={{} as never} />
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
                    <ProfileView authUser={{user: UserStub(), pending: true}} profile={{} as never} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByText(fr.common.loading)).toBeInTheDocument();

    });

    it('should render update the user', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const update = jest.fn();
        const user = UserStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView authUser={{user, pending: false}} profile={{saveChanges: update} as never} />
                </RouterContext.Provider>
            </Provider>
        )
        const input = screen.getByLabelText(fr.account.profile.pseudo) as HTMLInputElement;
        const submit = screen.getByText(fr.common.save) as HTMLButtonElement;
        const pseudo = "Nouveau pseudo";
        act(() => {
            fireEvent.change(input, {target: {value: pseudo}})
        })
        expect(input.value).toBe(pseudo);
        act(() => {
            fireEvent.click(submit);
        })
        expect(update).toHaveBeenCalledWith({pseudo}, {...user});

    });

    it('should render update the user profile picture', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const update = jest.fn();
        const user = UserStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView authUser={{user, pending: false}} profile={{uploadFile: update} as never} />
                </RouterContext.Provider>
            </Provider>
        )
        const input = screen.getByLabelText(fr.account.profile.upload) as HTMLInputElement;
        const file = new File(['-----'], 'picture.png', {type: "image/png"})

        act(() => {
            fireEvent.change(input, {target: {files: [file]}})
        })
        expect(update).toHaveBeenCalledWith([file]);

    });

    it('should render deleting the user profile picture', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const update = jest.fn();
        const pictureUrl = "https://via.placeholder.com/150/92c952";
        const user = {
            ...UserStub(),
            picture: pictureUrl
        };

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ProfileView authUser={{user, pending: false}} profile={{removeProfilePicture: update} as never} />
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
        expect(update).toHaveBeenCalledWith();
    });

});