import {makeStore} from "../../../../../../context/store";
import {MockUseRouter} from "../../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import UsersView from "../../../../../../components/admin/views/UsersView";
import * as fetch from "../../../../../../context/instance";
import {UserStub} from "../../../../../stub/UserStub";
import fr from "../../../../../../public/static/locales/fr.json";
import {getLikedPosts} from "../../../../../../context/actions/posts/posts.actions";
import {getCommentedPostByUserId} from "../../../../../../context/actions/admin/admin.actions";
import {PostStub} from "../../../../../stub/PostStub";
import {CommentStub} from "../../../../../stub/CommentStub";
import {queryByContent} from "../../../../../utils/CustomQueries";
import UserDetailsModalContent from "../../../../../../components/admin/modals/details/UserDetailsModalContent";

describe('UserDetailsModalTest', function () {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the user details with data and navigate to a post', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValueOnce({
                data: [PostStub()]
            }).mockResolvedValueOnce({
            data: [{...PostStub(), comments: [CommentStub()]}]
        }).mockResolvedValueOnce({
            data: [UserStub()]
        })

        await store.dispatch(getLikedPosts(UserStub()._id));
        await store.dispatch(getCommentedPostByUserId(UserStub()._id));

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UsersView />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(UserStub().pseudo)).toBeInTheDocument();
        })

        fireEvent.click(screen.getByText(UserStub().pseudo));

        await waitFor(() => {
            expect(screen.getByText(fr.admin.details)).toBeInTheDocument();
        })

        fireEvent.click(screen.getAllByRole("listitem")[1]);

        expect(screen.getByText(PostStub().title)).toBeInTheDocument();

        fireEvent.click(screen.getByText(PostStub().title));

        await waitFor(() => {
            expect(queryByContent("post-details-content")).toBeInTheDocument();
        })

        fireEvent.click(queryByContent("previous-modal"));

        await waitFor(() => {
            expect(queryByContent("user-details-content")).toBeInTheDocument();
        })

        fireEvent.click(screen.getAllByRole("listitem")[2]);

        expect(screen.getByText(PostStub().title)).toBeInTheDocument();

        fireEvent.click(screen.getByText(PostStub().title));

        await waitFor(() => {
            expect(queryByContent("post-details-content")).toBeInTheDocument();
        })

        fireEvent.click(queryByContent("previous-modal"));

        await waitFor(() => {
            expect(queryByContent("user-details-content")).toBeInTheDocument();
        })

    });

    it('should fetch user while rendering the details modal', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        jest.spyOn(fetch, "fetchApi")
            .mockResolvedValueOnce({
                data: UserStub()
            })

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UserDetailsModalContent setOtherModal={jest.fn()} needFetch={true} userId={UserStub()._id} />
                </RouterContext.Provider>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText(UserStub().pseudo)).toBeInTheDocument();
        })

    });


});