import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import * as fr from "../../../public/static/locales/fr.json";
import Home from "../../../pages";
import * as hooks from "../../../context/hooks";
import {HydrateStatus} from "../../../context/reducers/firstHydrate.reducer";
import {PostStub} from "../../stub/PostStub";

describe('IndexTest', function () {

    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should render the index page', async function () {

        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Home />
                </RouterContext.Provider>
            </Provider>
        )
        await waitFor(() => {
            expect(screen.getByText(fr.common.noPost)).toBeInTheDocument();
        })
    });

    it('should render the index page loading with posts', async function () {

        const store = makeStore();
        const router = MockUseRouter({});


        jest.spyOn(hooks, "useAppSelector")
            .mockReturnValueOnce({posts: [PostStub()], pending: true})
            .mockReturnValueOnce({status: HydrateStatus.MORE})

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Home />
                </RouterContext.Provider>
            </Provider>
        )
        await waitFor(() => {
            expect(screen.getByText(PostStub().title)).toBeInTheDocument();
        })
    });


});