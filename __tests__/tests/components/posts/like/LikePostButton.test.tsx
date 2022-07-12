import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {makeStore} from "../../../../../context/store";
import {Provider} from "react-redux";
import {RouterContext} from "next/dist/shared/lib/router-context";
import LikePostButton from "../../../../../components/posts/like/LikePostButton";
import {PostStub} from "../../../../stub/PostStub";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {queryByContent} from "../../../../utils/CustomQueries";
import {UserStub} from "../../../../stub/UserStub";
import fr from '../../../../../public/static/locales/fr.json'
import {IPost, LikeStatus} from "../../../../../shared/types/post.type";
import * as fetch from "../../../../../context/instance";
import {IUser} from "../../../../../shared/types/user.type";

describe('Like Post Button', function () {

    describe('UnAuth', function () {

        it('should render the unAuth like post button', () => {

            const router = MockUseRouter({locale: "fr"});
            const store = makeStore();
            const post = PostStub();
            render(
                <Provider store={store}>
                    <RouterContext.Provider value={router}>
                        <LikePostButton post={post} user={{} as IUser} />
                    </RouterContext.Provider>
                </Provider>
            )
            expect(queryByContent('likes-count')).not.toBeDefined();
            expect(queryByContent("heart-icon").className).not.toContain("active");
            expect(screen.getByText(fr.posts.like.needLoggedIn))
            fireEvent.click(queryByContent("heart-box"));

        })

    });

    describe('Auth', function () {

        it('should render the like button with n likes', () => {

            const router = MockUseRouter({locale: "fr"});
            const store = makeStore();
            const post: IPost = {
                ...PostStub(),
                likes: 3
            }
            render(
                <Provider store={store}>
                    <RouterContext.Provider value={router}>
                        <LikePostButton post={post} user={UserStub()} />
                    </RouterContext.Provider>
                </Provider>
            )
            expect(queryByContent('likes-count').textContent).toContain('3');
            expect(queryByContent('likes-count').textContent).toContain('mentions');
        })

        it('should like the post', () => {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: 4
            })
            const router = MockUseRouter({locale: "fr"});
            const store = makeStore();
            const post: IPost = {
                ...PostStub(),
                likes: 3
            }
            render(
                <Provider store={store}>
                    <RouterContext.Provider value={router}>
                        <LikePostButton post={post} user={UserStub()} />
                    </RouterContext.Provider>
                </Provider>
            )
            waitFor(() => {
                expect(queryByContent('likes-count').textContent).toContain("3");
                expect(queryByContent('heart-icon').className).not.toContain("active");
                fireEvent.click(queryByContent("heart-box"));
                expect(spy).toHaveBeenCalledWith(`/posts/${LikeStatus.LIKE}/${post.slug}`);
                expect(queryByContent('likes-count').textContent).toContain("4");
                expect(queryByContent('heart-icon').className).toContain("active");
            })
            spy.mockClear();
        })

        it('should unlike the post', () => {
            const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: 2
            })
            const router = MockUseRouter({locale: "fr"});
            const store = makeStore();
            const post: IPost = {
                ...PostStub(),
                likes: 3,
                authUserLiked: true
            }
            render(
                <Provider store={store}>
                    <RouterContext.Provider value={router}>
                        <LikePostButton post={post} user={UserStub()} />
                    </RouterContext.Provider>
                </Provider>
            )
            waitFor(() => {
                expect(queryByContent('likes-count').textContent).toContain("3");
                expect(queryByContent('heart-icon').className).toContain("active");
                fireEvent.click(queryByContent("heart-box"));
                expect(spy).toHaveBeenCalledWith(`/posts/${LikeStatus.UNLIKE}/${post.slug}`);
                expect(queryByContent('likes-count').textContent).toContain("2");
                expect(queryByContent('heart-icon').className).not.toContain("active");
            })
        })

    });

});