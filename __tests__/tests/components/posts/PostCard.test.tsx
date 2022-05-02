import {fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import React from 'react'
import {useTranslation} from "../../../../shared/hooks";
import * as fr from '../../../../public/static/locales/fr.json'
import PostCard from "../../../../components/posts/PostCard";
import {PostStub} from "../../../stub/PostStub";
import {queryByContent} from "../../../utils/CustomQueries";
import {getTimeSinceMsg, timeSince} from "../../../../shared/utils/date.utils";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUserRouter} from "../../../utils/MockUserRouter";
import {MatchPush} from "../../../utils/MatchPush";

jest.mock('../../../../shared/hooks');

describe('Post', () => {
    beforeEach(() => {
        jest.mock('../../tests/stub/ford-f-100-eluminator-concept.jpg');
        (useTranslation as jest.Mock).mockReturnValue(fr);
    })
    describe('Post Card', () => {

        it('should renders a post card', async () => {
            const post = PostStub();
            render(
                <PostCard post={post} />
            )
            expect(queryByContent('post-card')).toBeInTheDocument();
            expect(screen.getByAltText(post.title)).toBeInTheDocument();
            expect(screen.getByText(post.title)).toBeInTheDocument();
            expect(screen.getByText(fr.posts.readMore)).toBeInTheDocument();
            const postDesc = queryByContent('desc')
            expect(postDesc).toBeInTheDocument();
            expect(postDesc.textContent).toBe(post.desc)
            expect(screen.getByText(post.sourceName)).toBeInTheDocument();
            const sourceNameLink = screen.getByText(post.sourceName)
            expect(sourceNameLink).toBeInTheDocument();
            expect(sourceNameLink).toHaveAttribute('href', post.sourceLink);
            expect(sourceNameLink).toHaveAttribute('target', '_blank');
            expect(screen.getByText(getTimeSinceMsg(useTranslation(), timeSince(post.createdAt)))).toBeInTheDocument();
        })

        it('should render a post card with more than 2 categories', () => {
            const post = PostStub();
            render(
                <PostCard post={post} />
            )
            for (let i = 0; i < post.categories.length; i++) {
                const category = screen.queryByText(post.categories[i].name);
                if (i < 2) expect(category).toBeInTheDocument();
                else expect(category).not.toBeInTheDocument();
            }
            const plus = screen.queryByText(`+ ${post.categories.length - 2}`);
            expect(plus).toBeInTheDocument()

            expect(queryByContent('categories').children.length).toBe(3);
        })

        it('should render a post card with less than 2 categories', () => {
            const post = PostStub();
            render(
                <PostCard post={{
                    ...post,
                    categories: [
                        post.categories[0]
                    ]
                }} />
            )
            const category = screen.queryByText(post.categories[0].name);
            expect(category).toBeInTheDocument();

            const plus = screen.queryByText(/^\+ [0-9]+$/);
            expect(plus).not.toBeInTheDocument()
        })

        it('should redirect to the post page', () => {
            const post = PostStub();
            const router = MockUserRouter({})
            render(
                <RouterContext.Provider value={router}>
                    <PostCard post={post} />
                </RouterContext.Provider>
            )
            const imageLink = screen.getByAltText(post.title).closest('a') as HTMLAnchorElement;
            expect(imageLink).toHaveAttribute('href', `/post/${post.slug}`);
            const btn = screen.getByText(fr.posts.readMore);
            expect(btn).toBeInTheDocument();
            fireEvent.click(btn);
            MatchPush(router, `/post/${post.slug}`);

            fireEvent.click(imageLink);
            MatchPush(router, `/post/${post.slug}`);
        })
    })
})