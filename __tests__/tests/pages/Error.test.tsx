import {MockUseRouter} from "../../utils/MockUseRouter";
import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Error from "../../../pages/_error";
import * as fr from "../../../public/static/locales/fr.json"

describe('ErrorTest', function () {

    it('should render the error page', function () {
        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <Error statusCode={404} />
            </RouterContext.Provider>
        )
        expect(screen.getByText(fr.common.error.replace('{{code}}', "404")));
        expect(screen.getByText(fr.common.errorSub));
    });

    it('should render the error page with custom message', function () {
        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <Error statusCode={404} customMessage={"custom"} />
            </RouterContext.Provider>
        )
        expect(screen.getByText("custom"));
    });


});