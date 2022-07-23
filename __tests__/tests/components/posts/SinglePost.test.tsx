import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {UserStub} from "../../../stub/UserStub";
import {PostStub} from "../../../stub/PostStub";
import SinglePost from "../../../../components/posts/SinglePost";
import {queryByContent} from "../../../utils/CustomQueries";
import {IUserRole} from "../../../../shared/types/user.type";
import * as fr from '../../../../public/static/locales/fr.json'
import * as actions from '../../../../context/actions/posts/posts.actions';
import * as fetch from '../../../../context/instance';

describe('SinglePostTest', function () {


    afterEach(() => {
        jest.clearAllMocks();

    })

    it('should render the single post', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub();
        const post = PostStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SinglePost post={post} lastPostPending={false}
                                postPending={false} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("single-post")).toBeInTheDocument();
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.sourceName)).toBeInTheDocument();

    });

    it('should render the admin single post', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const user = UserStub(IUserRole.ADMIN);
        const post = PostStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SinglePost post={post} lastPostPending={false}
                                postPending={false} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("admin-actions")).toBeInTheDocument();

    });

    it('should delete the post', async function () {
        const store = makeStore();

        const push = jest.fn();

        const router = MockUseRouter({push});
        const user = UserStub(IUserRole.ADMIN);
        const post = PostStub();

        jest.spyOn(fetch, "fetchApi").mockResolvedValue({});
        const spy = jest.spyOn(actions, "cleanPost");

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <SinglePost post={post} lastPostPending={false}
                                postPending={false} user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.click(queryByContent("trash"));
        fireEvent.click(screen.getByRole("button", {name: fr.common.delete}));

        await waitFor(() => {
            expect(push).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
        })

    });


});