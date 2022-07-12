import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Layout from "../../../../components/layouts/Layout";
import {queryByContent} from "../../../utils/CustomQueries";

describe('LayoutTest', function () {
    it('should render the layout index', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Layout>
                        <></>
                    </Layout>
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("header")).toBeInTheDocument();
        expect(queryByContent("main")).toBeInTheDocument();
        expect(queryByContent("main")).not.toHaveClass("relative")
    });

    it('should render the layout somewhere else than index', function () {
        const store = makeStore();
        const router = MockUseRouter({pathname: "/write"});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Layout>
                        <></>
                    </Layout>
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("header")).toBeInTheDocument();
        expect(queryByContent("main")).toBeInTheDocument();
        expect(queryByContent("main")).toHaveClass("relative")
    });

});