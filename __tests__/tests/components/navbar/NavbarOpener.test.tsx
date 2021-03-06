import {fireEvent, render, screen} from "@testing-library/react";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {RouterContext} from "next/dist/shared/lib/router-context";
import NavbarOpener from "../../../../components/navbar/NavbarOpener";
import {Provider} from "react-redux";
import {makeStore} from "../../../../context/store";
import {UserStub} from "../../../stub/UserStub";

jest.mock("../../public/static/img/search_background-3.jpg");

describe('Nav Opener', function () {

    it('should render the button', () => {

        const router = MockUseRouter({});
        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <NavbarOpener user={UserStub()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByRole("button", {name: "Menu"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Menu"})).not.toHaveClass('hide');
    })

    it('should open the nav content', () => {

        const router = MockUseRouter({});
        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <NavbarOpener user={UserStub()} />
                </RouterContext.Provider>
            </Provider>
        )
        const menu = screen.getByRole('button', {name: 'Menu'});
        fireEvent.click(menu);
        expect(menu).toHaveClass('hide')
    });

    it('should hide the button', () => {
        const router = MockUseRouter({});
        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <NavbarOpener showButton={false} user={UserStub()} />
                </RouterContext.Provider>
            </Provider>
        )
        const menu = screen.getByRole('button', {name: 'Menu'});
        expect(menu).toHaveClass('hide')
    });

    it('should close the opened menu by the button on click in link', () => {
        const router = MockUseRouter({});
        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <NavbarOpener user={UserStub()} />
                </RouterContext.Provider>
            </Provider>
        )
        const menu = screen.getByRole('button', {name: 'Menu'});
        fireEvent.click(menu);
        expect(menu).toHaveClass('hide')
        const link = screen.getAllByRole('listitem')[0].children[0];
        fireEvent.click(link);
        expect(menu).not.toHaveClass('hide')
    })

});