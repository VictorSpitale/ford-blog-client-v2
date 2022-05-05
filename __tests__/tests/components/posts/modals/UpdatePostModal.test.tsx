import {render, screen} from "@testing-library/react";
import {PostStub} from "../../../../stub/PostStub";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import fr from '../../../../../public/static/locales/fr.json'
import {makeStore} from "../../../../../context/store";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import UpdatePostModal from "../../../../../components/posts/modals/UpdatePostModal";
import {useTranslation} from "../../../../../shared/hooks";
import * as hooks from "../../../../../context/hooks";

jest.mock('../../../../../shared/hooks');

describe('Update Post Modal', function () {

    it('should render the post modal', () => {
        const post = PostStub();
        const router = MockUseRouter({locale: "fr"});
        const store = makeStore();
        (useTranslation as jest.Mock).mockReturnValueOnce(fr);
        jest.spyOn(hooks, "useAppSelector").mockReturnValueOnce({
            categories: []
        }).mockReturnValueOnce({
            pending: false
        })
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} toggle={jest.fn} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByDisplayValue(post.title)).toBeInTheDocument();
        expect(screen.getByAltText(post.title)).toBeInTheDocument();
        expect(screen.getByDisplayValue(post.sourceName)).toBeInTheDocument();
        expect(screen.getByDisplayValue(post.sourceLink)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: fr.posts.update.fields.confirm})).toBeInTheDocument();
    })

    it('should render the post modal pending', () => {
        const post = PostStub();
        const router = MockUseRouter({locale: "fr"});
        const store = makeStore();
        (useTranslation as jest.Mock).mockReturnValueOnce(fr);
        jest.spyOn(hooks, "useAppSelector").mockReturnValueOnce({
            categories: []
        }).mockReturnValueOnce({
            pending: true
        })
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} toggle={jest.fn} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByRole('button', {name: fr.common.loading})).toBeInTheDocument();
    })

    it('should render the post modal with error', () => {
        const post = PostStub();
        const store = makeStore();
        const router = MockUseRouter({locale: "fr"});
        (useTranslation as jest.Mock).mockReturnValueOnce(fr);
        jest.spyOn(hooks, "useAppSelector").mockReturnValueOnce({
            categories: []
        }).mockReturnValueOnce({
            pending: false
        })
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} toggle={jest.fn} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )
        // fireEvent.change(screen.getByDisplayValue(post.title), {target: {value: ""}})
        // expect(screen.getByRole('button', {name: fr.posts.update.fields.confirm})).toBeInTheDocument();
        // expect(screen.getByText(fr.posts.update.errors.fields)).toBeInTheDocument();
    })

});