import {render} from "@testing-library/react";
import PostsList from "../../../../components/posts/PostsList";
import {queryAllByContent, queryByContent} from "../../../utils/CustomQueries";
import {PostStub} from "../../../stub/PostStub";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../utils/MockUseRouter";

describe('Last Post', function () {

    it('should render any post', () => {
        render(
            <PostsList posts={[]} />
        )
        expect(queryByContent('post-card')).not.toBeDefined();
    })

    it('should render n post card', () => {
        const posts = Array(3).fill(PostStub());
        render(
            <RouterContext.Provider value={MockUseRouter({})}>
                <PostsList posts={posts} />
            </RouterContext.Provider>
        )
        expect(queryAllByContent('post-card').length).toBe(3);
    })
});