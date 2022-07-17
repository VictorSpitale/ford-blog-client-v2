import {makeStore} from "../../../context/store";
import {MockUseRouter} from "../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import PostPage from "../../../pages/post/[slug]";
import {PostStub} from "../../stub/PostStub";
import * as fetch from "../../../context/instance";
import {getPost} from "../../../context/actions/posts.actions";
import {NextPageContext} from "next";

describe('PostTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    it('should render the error page on not found', function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PostPage error={{statusCode: 404, customMessage: "custom"}} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(push).toHaveBeenCalledWith("/404");
    });

    it('should render the error page if post is empty', async function () {
        const store = makeStore();
        const push = jest.fn();
        const router = MockUseRouter({push});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: PostStub()
        }).mockResolvedValueOnce({
            data: false
        })

        await store.dispatch(getPost({context: {} as NextPageContext, slug: "slug"}))

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PostPage />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(PostStub().title)).toBeInTheDocument();
        })
    });


});