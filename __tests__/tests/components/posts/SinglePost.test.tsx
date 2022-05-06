import {MockUseRouter} from "../../../utils/MockUseRouter";
import {useModal, useTranslation} from "../../../../shared/hooks";
import * as fr from "../../../../public/static/locales/fr.json";
import {fireEvent, render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import SinglePost from "../../../../components/posts/SinglePost";
import {PostStub} from "../../../stub/PostStub";
import * as redux from "../../../../context/hooks";
import {Provider} from "react-redux";
import {makeStore} from "../../../../context/store";
import {queryByContent} from "../../../utils/CustomQueries";
import {UserStub} from "../../../stub/UserStub";
import {IUserRole} from "../../../../shared/types/user.type";

jest.mock('../../../../shared/hooks');

describe('Single Post', function () {

    const post = PostStub();
    let isDeleteShowing = false;
    let isUpdateShowing = false;
    const toggleDelete = jest.fn(() => isDeleteShowing = !isDeleteShowing);
    const toggleUpdate = jest.fn(() => isUpdateShowing = !isUpdateShowing);
    let spy: jest.SpyInstance;
    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue(fr);
        (useModal as jest.Mock).mockReturnValueOnce(
            {toggle: toggleDelete, isShowing: isDeleteShowing}
        ).mockReturnValueOnce({
            toggle: toggleUpdate, isShowing: isUpdateShowing
        })
        spy = jest.spyOn(redux, 'useAppSelector')
    })

    describe('SinglePost Component unAuth', function () {
        beforeEach(() => {
            spy.mockReturnValue({user: {}})
            render(
                <Provider store={makeStore()}>
                    <RouterContext.Provider value={MockUseRouter({})}>
                        <SinglePost post={post}/>
                    </RouterContext.Provider>
                </Provider>
            )
        })
        it('should render the single post component', () => {
            expect(queryByContent('single-post')).toBeInTheDocument();
            expect(screen.getByRole("heading").textContent).toBe(post.title);
            for (let i = 0; i < post.categories.length; i++) {
                if (i < 3) {
                    expect(screen.getByText(post.categories[i].name)).toBeInTheDocument();
                } else {
                    expect(screen.queryByText(post.categories[i].name)).toBeNull();
                }
            }
            expect(queryByContent('desc-0').textContent).toContain(post.desc.split(/(?:\r\n|\r|\n)/g)[0]);
        })

        it('should not contain admin actions', () => {
            expect(queryByContent('trash')).not.toBeDefined();
            expect(queryByContent('edit')).not.toBeDefined();
        })

    });
    describe('Auth Admin', function () {
        beforeEach(() => {
            spy.mockReturnValue({user: UserStub(IUserRole.ADMIN)})
            render(
                <Provider store={makeStore()}>
                    <RouterContext.Provider value={MockUseRouter({})}>
                        <SinglePost post={post}/>
                    </RouterContext.Provider>
                </Provider>
            )
        })

        it('should contain admin actions', () => {
            expect(queryByContent('trash')).toBeDefined();
            expect(queryByContent('edit')).toBeDefined();
        })

        it('should open the delete modal', () => {
            expect(isDeleteShowing).toBe(false);
            fireEvent.click(queryByContent('trash'));
            expect(toggleDelete).toHaveBeenCalled();
            expect(isDeleteShowing).toBe(true)
        })

        it('should open the update modal', () => {
            expect(isUpdateShowing).toBe(false);
            fireEvent.click(queryByContent('edit'));
            expect(toggleUpdate).toHaveBeenCalled();
            expect(isUpdateShowing).toBe(true)
        })

    });

    describe('Auth Not Admin', function () {
        beforeEach(() => {
            spy.mockReturnValue({user: UserStub(IUserRole.POSTER)})
            render(
                <Provider store={makeStore()}>
                    <RouterContext.Provider value={MockUseRouter({})}>
                        <SinglePost post={post}/>
                    </RouterContext.Provider>
                </Provider>
            )
        })

        it('should not contain admin actions if user is poster', () => {
            expect(queryByContent('trash')).not.toBeDefined();
            expect(queryByContent('edit')).not.toBeDefined();
        })

    });

});