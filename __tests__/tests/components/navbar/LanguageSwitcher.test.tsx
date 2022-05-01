import {fireEvent, render, screen} from "@testing-library/react";
import LanguageSwitcher from "../../../../components/navbar/LanguageSwitcher";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUserRouter} from "../../../utils/MockUserRouter";
import {queryByContent} from "../../../utils/CustomQueries";

describe('Language Switcher', function () {

    it('should render the language switcher', () => {
        render(
            <RouterContext.Provider value={MockUserRouter({locale: "fr"})}>
                <LanguageSwitcher />
            </RouterContext.Provider>
        )
        const current = queryByContent("current-language");
        expect(current.className).toBe("fr");
    })

    it('should render the french flag by default', () => {
        render(
            <RouterContext.Provider value={MockUserRouter({})}>
                <LanguageSwitcher />
            </RouterContext.Provider>
        )
        const current = queryByContent("current-language");
        expect(current.className).toBe("fr");
    })

    it('should generate the other languages options', () => {
        render(
            <RouterContext.Provider value={MockUserRouter({locale: "fr", locales: ["en"]})}>
                <LanguageSwitcher />
            </RouterContext.Provider>
        )
        const dropdown = screen.getByRole('list');
        expect(dropdown.children.length).toBe(1);
        const items = screen.getAllByRole('listitem');
        expect(items.length).toBe(1);
        expect(items[0].children[0].className).toBe("en");
    })

    it('should change the language', () => {
        const mockedRouter = MockUserRouter({locale: "fr", locales: ["en"]});
        render(
            <RouterContext.Provider value={mockedRouter}>
                <LanguageSwitcher />
            </RouterContext.Provider>
        )
        expect(mockedRouter.pathname).toBe("/")
        const items = screen.getAllByRole('listitem');
        fireEvent.click(items[0]);
        expect(mockedRouter.push).toHaveBeenCalledWith(mockedRouter.asPath, mockedRouter.asPath, {locale: items[0].children[0].className});
    })

});