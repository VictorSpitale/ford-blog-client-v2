import {fireEvent, render, screen} from "@testing-library/react";
import SignWithGoogle, {SignStatus} from "../../../../components/shared/SignWithGoogle";

describe('SignWithGoogleTest', function () {

    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules() // Most important - it clears the cache
        process.env = {...OLD_ENV}; // Make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    it('should render the button', function () {

        process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete window.location;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location = {};
        const setHrefSpy = jest.fn();
        Object.defineProperty(window.location, 'href', {
            set: setHrefSpy,
        });

        render(
            <SignWithGoogle status={SignStatus.SIGN_UP} />
        )
        const btn = screen.getByText("Sign up with Google");
        fireEvent.click(btn);
        expect(setHrefSpy).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
    });

});