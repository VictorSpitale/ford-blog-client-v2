import {fireEvent, render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUserRouter} from "../../../utils/MockUserRouter";
import NavbarContent from "../../../../components/navbar/NavbarContent";
import * as redux from "../../../../context/hooks";
import {Provider} from "react-redux";
import {makeStore} from "../../../../context/store";
import {queryByContent} from "../../../utils/CustomQueries";
import fr from '../../../../public/static/locales/fr.json'
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";

describe('Navbar Content', function () {

    describe('UnAuth', function () {

        const fn = jest.fn();
        beforeEach(() => {
            const router = MockUserRouter({locale: "fr"});
            render(
                <Provider store={makeStore()}>
                    <RouterContext.Provider value={router}>
                        <NavbarContent showContent={true} closeContent={fn} />
                    </RouterContext.Provider>
                </Provider>
            )
        })

        it('render the navbar content', () => {
            expect(screen.getByRole('list')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(screen.getAllByRole('listitem').length).toBe(5);
        })

        it('should close the content on link click', () => {
            fireEvent.click(screen.getAllByRole('listitem')[0]);
            expect(fn).toHaveBeenCalled();
        })

        it('should close the content on escape', () => {
            fireEvent.keyDown(window, {key: 'Escape'});
            expect(fn).toHaveBeenCalled();
        })

        it('should close the content on exit button', () => {
            fireEvent.click(queryByContent('close-nav-content'));
            expect(fn).toHaveBeenCalled();
        })

        it('should not render required auth link if no user', () => {
            expect(screen.queryByText(fr.common.navbar["3"])).toBeNull();
        })
    });

    describe('Auth', function () {
        it('should not render specific role required links', () => {
            const router = MockUserRouter({locale: "fr"});
            const fn = jest.fn();

            const spy = jest.spyOn(redux, 'useAppSelector')
            spy.mockReturnValue({user: UserStub()})
            render(
                <Provider store={makeStore()}>
                    <RouterContext.Provider value={router}>
                        <NavbarContent showContent={true} closeContent={fn} />
                    </RouterContext.Provider>
                </Provider>
            )
            expect(screen.queryByText(fr.common.navbar["3"])).toBeNull();
        })
        it('should render specific role required links', () => {
            const router = MockUserRouter({locale: "fr"});
            const fn = jest.fn();
            const spy = jest.spyOn(redux, 'useAppSelector')
            spy.mockReturnValue({user: UserStub(IUserRole.ADMIN)})
            render(
                <Provider store={makeStore()}>
                    <RouterContext.Provider value={router}>
                        <NavbarContent showContent={true} closeContent={fn} />
                    </RouterContext.Provider>
                </Provider>
            )
            expect(screen.queryByText(fr.common.navbar["3"])).toBeInTheDocument();
        })

    });

});