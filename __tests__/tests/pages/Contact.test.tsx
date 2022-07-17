import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Contact from "../../../pages/contact";
import * as fr from "../../../public/static/locales/fr.json";

describe('ContactTest', function () {

    it('should render the contact page', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Contact />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.contact.formTitle)).toBeInTheDocument();
    });


});