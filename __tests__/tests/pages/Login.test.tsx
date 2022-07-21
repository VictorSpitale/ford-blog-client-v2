import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Login from "../../../pages/login";
import * as hooks from "../../../context/hooks";
import {UserStub} from "../../stub/UserStub";
import * as fr from "../../../public/static/locales/fr.json";

describe('LoginTest', function () {

    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should render the login page', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Login />
                </RouterContext.Provider>
            </Provider>
        );

        expect(screen.getByText(fr.login.connect)).toBeInTheDocument();
    });

    it('should redirect on Auth', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({user: UserStub()})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Login />
                </RouterContext.Provider>
            </Provider>
        );

        expect(push).toHaveBeenCalledWith("/account")
    });

});