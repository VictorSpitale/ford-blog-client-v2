import {makeStore} from "../../../../../../context/store";
import {MockUseRouter} from "../../../../../utils/MockUseRouter";
import * as fetch from "../../../../../../context/instance";
import {PostStub} from "../../../../../stub/PostStub";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import PostsView from "../../../../../../components/admin/views/PostsView";
import fr from "../../../../../../public/static/locales/fr.json";
import {UserStub} from "../../../../../stub/UserStub";
import {getPostLikers} from "../../../../../../context/actions/admin/admin.actions";
import {queryByContent} from "../../../../../utils/CustomQueries";
import {CommentStub} from "../../../../../stub/CommentStub";

describe('PostDetailsModalTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should open details modals and navigate', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
            data: [UserStub()]
        }).mockResolvedValueOnce({
            data: {hasMore: true, page: 1, posts: [{...PostStub(), comments: [CommentStub()]}]}
        }).mockResolvedValueOnce({
            data: []
        });

        await store.dispatch(getPostLikers(PostStub().slug));

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

        fireEvent.click(screen.getByText(PostStub().title));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.details)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(PostStub().categories[0].name));

        await waitFor(() => {
            expect(queryByContent("category-details-content")).toBeInTheDocument();
            expect(queryByContent("previous-modal")).toBeInTheDocument();
        })

        fireEvent.click(queryByContent("previous-modal"));

        await waitFor(() => {
            expect(queryByContent("post-details-content")).toBeInTheDocument();
        })

        fireEvent.click(screen.queryAllByRole("listitem")[1]);

        await waitFor(() => {
            expect(screen.getByText(UserStub().pseudo));
        })

        fireEvent.click(screen.getByText(UserStub().pseudo));

        await waitFor(() => {
            expect(queryByContent("user-details-content")).toBeInTheDocument();
        })

        fireEvent.click(queryByContent("previous-modal"));

        await waitFor(() => {
            expect(queryByContent("post-details-content")).toBeInTheDocument();
        })

        fireEvent.click(screen.queryAllByRole("listitem")[2]);

        await waitFor(() => {
            expect(screen.getByText(CommentStub().commenter.pseudo));
        })

        fireEvent.click(screen.getByText(CommentStub().commenter.pseudo));

        await waitFor(() => {
            expect(queryByContent("user-details-content")).toBeInTheDocument();
        })

    });


});