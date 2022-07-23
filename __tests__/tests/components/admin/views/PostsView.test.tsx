import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import PostsView from "../../../../../components/admin/views/PostsView";
import * as fetch from "../../../../../context/instance";
import fr from "../../../../../public/static/locales/fr.json";
import {PostStub} from "../../../../stub/PostStub";
import * as actions from "../../../../../context/actions/posts/posts.actions";
import {queryByContent} from "../../../../utils/CustomQueries";

describe('PostsViewTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the posts view without posts', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: {hasMore: false, page: 1, posts: []}
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PostsView />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.noPost)).toBeInTheDocument();
    });

    it('should render the posts view with post, fetch more and open details modals', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: {hasMore: true, page: 1, posts: [PostStub()]}
        }).mockResolvedValueOnce({
            data: {hasMore: false, page: 2, posts: []}
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PostsView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.queryByText(fr.common.noPost)).not.toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.loadMore));
        expect(spy).toHaveBeenCalledTimes(2);

        fireEvent.click(screen.getByText(PostStub().title));


        await waitFor(() => {
            expect(screen.getByText(fr.admin.details)).toBeInTheDocument();
        })
    });


    it('should open delete modals', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: {hasMore: true, page: 1, posts: [PostStub()]}
        }).mockResolvedValueOnce({});

        const deleteSpy = jest.spyOn(actions, "deletePost")

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PostsView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.queryByText(fr.common.noPost)).not.toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.delete));

        await waitFor(() => {
            expect(screen.getAllByText(fr.common.delete)[0]).toBeInTheDocument();
        })

        fireEvent.click(screen.getAllByText(fr.common.delete)[1]);

        expect(deleteSpy).toHaveBeenCalledWith(PostStub().slug);

    });

    it('should open update modals', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: {hasMore: true, page: 1, posts: [PostStub()]}
        });

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <PostsView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.queryByText(fr.common.noPost)).not.toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(fr.common.update));

        await waitFor(() => {
            expect(queryByContent("update-post-modal")).toBeInTheDocument();
        })

    });


});