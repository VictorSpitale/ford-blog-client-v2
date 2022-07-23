import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import * as hooks from "../../../context/hooks";
import {UserStub} from "../../stub/UserStub";
import * as fr from "../../../public/static/locales/fr.json";
import Register from "../../../pages/register";

describe('RegisterTest', function () {

    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should render the register page', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Register />
                </RouterContext.Provider>
            </Provider>
        );

        expect(screen.getByText(fr.register.register)).toBeInTheDocument();
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
                    <Register />
                </RouterContext.Provider>
            </Provider>
        );

        expect(push).toHaveBeenCalledWith("/account")
    });

});