import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import React from 'react'
import {useTranslation} from "../shared/hooks";
import * as fr from '../public/static/locales/fr.json'
import PostCard from "../components/posts/PostCard";
import {PostStub} from "./stub/PostStub";

jest.mock('../shared/hooks');

describe('Post', () => {
    it('renders a post card', () => {
        jest.mock('../../tests/stub/ford-f-100-eluminator-concept.jpg');
        (useTranslation as jest.Mock).mockReturnValue(fr);
        const post = PostStub();
        render(
            <PostCard post={post} />
        )

        const title = screen.getByText(post.title);
        const btn = screen.getByText(fr.posts.readMore);

        expect(title).toBeInTheDocument();
        expect(btn).toBeInTheDocument();

    })
})