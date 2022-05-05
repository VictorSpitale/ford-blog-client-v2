import {render, screen, waitFor} from "@testing-library/react";
import {PostStub} from "../../../../stub/PostStub";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import fr from '../../../../../public/static/locales/fr.json'
import {makeStore} from "../../../../../context/store";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import UpdatePostModal from "../../../../../components/posts/modals/UpdatePostModal";
import {useTranslation} from "../../../../../shared/hooks";
import * as hooks from "../../../../../context/hooks";
import React, {useRef} from "react";
import {mocked} from "jest-mock";
import {isEmpty} from '../../../../../shared/utils/object.utils'

jest.mock('../../../../../shared/hooks');
jest.mock('../../../../../shared/utils/object.utils');
jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useRef: jest.fn(),
    };
});
jest.mock(
    "next/image",
    () =>
        function Image({src, alt}: { src: string, alt: string }) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={src} alt={alt} />
        },
)
jest.mock("../../../../../components/categories/SelectCategories", () => function SelectCategories() {
        return <div />
    }
)
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

    it('should render the post modal with error', async () => {
        const post = PostStub();
        const store = makeStore();
        const router = MockUseRouter({locale: "fr"});
        (useTranslation as jest.Mock).mockReturnValueOnce(fr);
        jest.spyOn(hooks, "useAppSelector").mockReturnValueOnce({
            categories: []
        }).mockReturnValueOnce({
            pending: false
        });
        (isEmpty as jest.Mock).mockReturnValue(true);
        const ref = {current: {}};
        const mScrollBy = jest.fn();
        Object.defineProperty(ref, 'current', {
            set(_current) {
                if (_current) {
                    _current.scrollTo = mScrollBy;
                }
                this._current = _current;
            },
            get() {
                return this._current;
            },
        });
        const useMockRef = mocked(useRef);
        useMockRef.mockReturnValueOnce(ref);
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <UpdatePostModal post={post} toggle={jest.fn} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )
        // fireEvent.change(screen.getByDisplayValue(post.title), {target: {value: ""}})
        // fireEvent.click(screen.getByRole('button', {name: fr.posts.update.fields.confirm}))
        await waitFor(() => {
            screen.debug();
        })
        // expect(screen.getByText(fr.posts.update.errors.fields)).toBeInTheDocument();
    })

});