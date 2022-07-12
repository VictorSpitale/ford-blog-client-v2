import {MockUseRouter} from "../../../utils/MockUseRouter";
import {render} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import SEO from "../../../../components/shared/seo";

describe('SeoTest', function () {
    it('should render the seo component', async function () {
        const router = MockUseRouter({});

        const {rerender} = render(
            <RouterContext.Provider value={router}>
                <SEO title={"titre"} />
            </RouterContext.Provider>
            , {container: document.head})

        rerender(
            <RouterContext.Provider value={router}>
                <SEO title={"titre"} siteTitle={"site title"} description={"desc"} shouldIndex={false} />
            </RouterContext.Provider>
        )
    });

});