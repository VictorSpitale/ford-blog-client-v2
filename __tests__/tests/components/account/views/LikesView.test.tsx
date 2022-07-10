import {render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import LikesView from "../../../../../components/account/views/LikesView";
import {queryByContent} from "../../../../utils/CustomQueries";
import * as fr from '../../../../../public/static/locales/fr.json';
import {BasicPostStub} from "../../../../stub/PostStub";

describe('Likes View', function () {

    it('should render the likes view', function () {

        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <LikesView likes={{likedPosts: [], pending: false}} />
            </RouterContext.Provider>
        )
        expect(queryByContent("view-title")).toBeInTheDocument();

    });

    it('should render the likes view pending', function () {

        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <LikesView likes={{likedPosts: [], pending: true}} />
            </RouterContext.Provider>
        )
        expect(screen.queryByText(fr.common.loading)).toBeInTheDocument();

    });

    it('should render a liked post', function () {

        const router = MockUseRouter({});
        const basicPost = BasicPostStub();

        render(
            <RouterContext.Provider value={router}>
                <LikesView likes={{likedPosts: [basicPost], pending: false}} />
            </RouterContext.Provider>
        )
        expect(screen.queryByText(basicPost.title)).toBeInTheDocument();

    });

});