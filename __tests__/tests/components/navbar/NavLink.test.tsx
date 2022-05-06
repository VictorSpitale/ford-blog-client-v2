import {fireEvent, render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import NavLink from "../../../../components/navbar/NavLink";

describe('NavLink', function () {

    it('should render a link', () => {

        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <NavLink href={"/about"} label={"About"} />
            </RouterContext.Provider>
        )

        expect(screen.queryByText('About')).toBeInTheDocument();
        expect(screen.queryByText('About')).toHaveAttribute('href', "/about")

    })

    it('should navigate on click', () => {

        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <NavLink href={"/about"} label={"About"} />
            </RouterContext.Provider>
        )
        fireEvent.click(screen.getByText('About'));
        expect(router.push).toHaveBeenCalledWith('/about', "/about", expect.anything());

    })

});