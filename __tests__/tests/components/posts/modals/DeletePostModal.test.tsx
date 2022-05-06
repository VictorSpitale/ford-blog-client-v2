import * as hooks from '../../../../../context/hooks'
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {useTranslation} from "../../../../../shared/hooks";
import fr from '../../../../../public/static/locales/fr.json'
import {fireEvent, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {makeStore} from "../../../../../context/store";
import {RouterContext} from "next/dist/shared/lib/router-context";
import DeletePostModal from "../../../../../components/posts/modals/DeletePostModal";
import {PostStub} from "../../../../stub/PostStub";
import {queryByContent} from "../../../../utils/CustomQueries";
import {capitalize} from "../../../../../shared/utils/string.utils";
import {instance} from "../../../../../context/instance";

jest.mock('../../../../../shared/hooks');

describe('Delete Post Modal', function () {

    it('should render the delete post modal', () => {
        jest.spyOn(hooks, "useAppSelector").mockReturnValue({
            pending: false
        })
        const router = MockUseRouter({locale: "fr"});
        (useTranslation as jest.Mock).mockReturnValueOnce(fr)
        const store = makeStore();
        const post = PostStub();
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <DeletePostModal post={post} toggle={jest.fn} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(queryByContent('cross')).toBeDefined();
        expect(screen.getByRole('button', {name: capitalize(fr.posts.delete.deleteAction)})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: fr.common.cancel})).toBeInTheDocument();
    })

    it('should change the delete message on pending', () => {
        jest.spyOn(hooks, "useAppSelector").mockReturnValue({
            pending: true
        })
        const router = MockUseRouter({locale: "fr"});
        (useTranslation as jest.Mock).mockReturnValueOnce(fr)
        const store = makeStore();
        const post = PostStub();
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <DeletePostModal post={post} toggle={jest.fn} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByRole('button', {name: fr.posts.delete.deleteLoading})).toBeInTheDocument();
    })

    it('should toggle on cancel', () => {
        jest.spyOn(hooks, "useAppSelector").mockReturnValue({
            pending: true
        })
        const toggle = jest.fn();
        const router = MockUseRouter({locale: "fr"});
        (useTranslation as jest.Mock).mockReturnValueOnce(fr)
        const store = makeStore();
        const post = PostStub();
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <DeletePostModal post={post} toggle={toggle} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )
        fireEvent.click(screen.getByText(fr.common.cancel));
        expect(toggle).toHaveBeenCalled();
    })

    it('should delete the post', () => {
        jest.spyOn(hooks, "useAppSelector").mockReturnValue({
            pending: false
        })
        const push = jest.fn().mockResolvedValue(true);
        const dispatch = jest.spyOn(hooks, "useAppDispatch");
        const router = MockUseRouter({locale: "fr", push});
        (useTranslation as jest.Mock).mockReturnValueOnce(fr)
        const store = makeStore();
        const post = PostStub();
        const spy = jest.spyOn(instance, "delete").mockResolvedValue({});
        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <DeletePostModal post={post} toggle={jest.fn} isShowing={true} />
                </RouterContext.Provider>
            </Provider>
        )
        fireEvent.click(screen.getByRole('button', {name: capitalize(fr.posts.delete.deleteAction)}));
        expect(spy).toHaveBeenCalledWith(`/posts/${post.slug}`);
        expect(dispatch).toHaveBeenCalled();
        // mock calls inside dispatch......
    })

});