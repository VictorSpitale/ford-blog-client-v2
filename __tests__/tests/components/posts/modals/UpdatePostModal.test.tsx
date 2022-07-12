import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import UpdatePostModal from "../../../../../components/posts/modals/UpdatePostModal";
import {IPost} from "../../../../../shared/types/post.type";
import {ICategory} from "../../../../../shared/types/category.type";
import {PostStub} from "../../../../stub/PostStub";
import {CategoryStub} from "../../../../stub/CategoryStub";
import {queryByContent} from "../../../../utils/CustomQueries";
import fr from "../../../../../public/static/locales/fr.json";
import * as actions from "../../../../../context/actions/posts.actions";
import * as fetch from "../../../../../context/instance";
import * as refUtils from '../../../../../shared/utils/refs.utils';

describe('UpdatePostModalTest', function () {

    let post: IPost;
    let updatedCategories: ICategory[];
    let pending: boolean;
    let categories: ICategory[];

    beforeEach(() => {
        post = PostStub();
        updatedCategories = [];
        pending = false;
        categories = [CategoryStub()];
    })

    it('should render the update post modal', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} updatedCategories={updatedCategories} categories={categories}
                                     pending={pending} categoriesPending={false} isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect((queryByContent("title") as HTMLInputElement).value).toBe(post.title);
        expect((queryByContent("sourceName") as HTMLInputElement).value).toBe(post.sourceName);
        expect((queryByContent("sourceLink") as HTMLInputElement).value).toBe(post.sourceLink);
        expect((queryByContent("desc") as HTMLTextAreaElement).value).toBe(post.desc);

    });

    it('should render the update post modal loading', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        pending = true;

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} updatedCategories={updatedCategories} categories={categories}
                                     pending={pending} categoriesPending={false} isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.loading)).toBeInTheDocument()

    });

    it('should render the update post modal with errors', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        const updateSpy = jest.spyOn(actions, "updatePost")
        const fetchSpy = jest.spyOn(fetch, "fetchApi").mockRejectedValue({});
        jest.spyOn(refUtils, "scrollTop").mockImplementation(() => {
            return null;
        })

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} updatedCategories={updatedCategories} categories={categories}
                                     pending={pending} categoriesPending={false} isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )
        const submit = screen.getByText(fr.posts.update.fields.confirm);

        fireEvent.change(queryByContent("title"), {target: {value: "  "}});
        fireEvent.change(queryByContent("sourceName"), {target: {value: "  "}});
        fireEvent.change(queryByContent("desc"), {target: {value: "  "}});
        fireEvent.click(submit);
        expect(screen.getByText(fr.posts.update.errors.fields)).toBeInTheDocument();
        expect(updateSpy).not.toHaveBeenCalled();
        expect(fetchSpy).not.toHaveBeenCalled();

        fireEvent.change(queryByContent("title"), {target: {value: post.title}});
        fireEvent.change(queryByContent("sourceName"), {target: {value: post.sourceName}});
        fireEvent.change(queryByContent("desc"), {target: {value: post.desc}});
        fireEvent.click(submit);
        expect(screen.getByText(fr.posts.update.errors.categories)).toBeInTheDocument();
        expect(updateSpy).not.toHaveBeenCalled();
        expect(fetchSpy).not.toHaveBeenCalled();

        updatedCategories = categories;

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} updatedCategories={updatedCategories} categories={categories}
                                     pending={pending} categoriesPending={false} isShowing={true} toggle={jest.fn()} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.change(queryByContent("sourceLink"), {target: {value: "wrong link"}});
        fireEvent.click(submit);
        expect(screen.getByText(fr.posts.update.errors.link)).toBeInTheDocument();
        expect(updateSpy).not.toHaveBeenCalled();
        expect(fetchSpy).not.toHaveBeenCalled();

        fireEvent.change(queryByContent("sourceLink"), {target: {value: post.sourceLink}});
        fireEvent.click(submit);

        await waitFor(() => {
            expect(screen.getByText(fr.posts.update.errors.failed)).toBeInTheDocument();
            expect(updateSpy).toHaveBeenCalled();
            expect(fetchSpy).toHaveBeenCalled();
        })

    });

    it('should update the post', async function () {
        const store = makeStore();
        const router = MockUseRouter({});

        const updateSpy = jest.spyOn(actions, "updatePost")
        const fetchSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({});
        const toggle = jest.fn();
        updatedCategories = categories;

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} updatedCategories={updatedCategories} categories={categories}
                                     pending={pending} categoriesPending={false} isShowing={true} toggle={toggle} />
                </RouterContext.Provider>
            </Provider>
        )
        const submit = screen.getByText(fr.posts.update.fields.confirm);

        fireEvent.change(queryByContent("title"), {target: {value: `${post.title} !!`}});

        fireEvent.click(submit);

        await waitFor(() => {
            expect(updateSpy).toHaveBeenCalled();
            expect(fetchSpy).toHaveBeenCalled();
            expect(toggle).toHaveBeenCalled();
        })

    });

});