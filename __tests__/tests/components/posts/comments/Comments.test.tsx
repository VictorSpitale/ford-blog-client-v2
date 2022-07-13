import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {PostStub} from "../../../../stub/PostStub";
import {IPost} from "../../../../../shared/types/post.type";
import {IUser} from "../../../../../shared/types/user.type";
import {UserStub} from "../../../../stub/UserStub";
import Comments from "../../../../../components/posts/comments/Comments";
import fr from "../../../../../public/static/locales/fr.json";
import {queryByContent} from "../../../../utils/CustomQueries";
import {CommentStub} from "../../../../stub/CommentStub";
import * as actions from '../../../../../context/actions/posts.actions'
import * as fetch from '../../../../../context/instance'

describe('CommentsTest', function () {

    let post: IPost;
    let user: IUser;
    let pending: boolean;

    beforeEach(() => {
        post = PostStub();
        user = UserStub();
        pending = false;
    })


    it('should render the comments', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comments post={post} user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.getByText(fr.posts.comment.title.replace('{{count}}', "0").replace('{{s}}', ''))).toBeInTheDocument();
        expect(screen.getByText(fr.posts.comment.comment)).toBeInTheDocument();
        expect(queryByContent("new-comment")).toBeInTheDocument();
        expect(screen.getByText(fr.common.send)).toBeInTheDocument();
        expect(queryByContent("comments")).toHaveClass("cursor-default");
    });

    it('should render unAuth comments', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        user = {} as IUser;
        pending = true;

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comments post={post} user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.posts.comment.shouldLogin)).toBeInTheDocument();
        expect(queryByContent("comments")).toHaveClass("cursor-wait");
    });

    it('should delete a comment', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const comments = [CommentStub(), CommentStub("62cc3af35cb8d215944a7174")]
        post = {
            ...post,
            comments
        }

        const deleteSpy = jest.spyOn(actions, "deletePostComment")
        const fetchSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comments post={post} user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.posts.comment.title.replace('{{count}}', "2").replace('{{s}}', 's'))).toBeInTheDocument();

        for (const comment of post.comments) {
            expect(queryByContent(`comment-${comment._id}`)).toBeInTheDocument();
        }

        fireEvent.click(queryByContent("trash"));
        fireEvent.click(screen.getByRole("button", {name: fr.common.delete}));

        expect(fetchSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();

        await waitFor(() => {
            expect(queryByContent(`comment-${comments[0]._id}`)).not.toBeDefined();
        })

    });

    it('should update a comment', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const comments = [CommentStub(), CommentStub("62cc3af35cb8d215944a7174")]
        const newCommentMessage = "new comment";
        const newPost: IPost = {
            ...post,
            comments: [
                {
                    ...CommentStub(),
                    comment: newCommentMessage,
                    updatedAt: comments[0].createdAt
                },
                comments[1]
            ]
        }

        post = {
            ...post,
            comments
        }

        const updateSpy = jest.spyOn(actions, "updatePostComment");
        const fetchSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: newPost});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comments post={post} user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        for (const comment of post.comments) {
            expect(queryByContent(`comment-${comment._id}`)).toBeInTheDocument();
        }

        fireEvent.click(queryByContent("edit"));

        fireEvent.change(queryByContent("comment"), {target: {value: newCommentMessage}})
        fireEvent.click(screen.getByText(fr.common.confirm));

        expect(fetchSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByText(newCommentMessage)).toBeInTheDocument();
            expect(screen.getByText(fr.posts.comment.modified)).toBeInTheDocument();
            expect(queryByContent("comment")).not.toBeDefined();
        })

    });

    it('should fail to post a new comment', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const submitSpy = jest.spyOn(actions, "commentPost")
        const fetchSpy = jest.spyOn(fetch, "fetchApi").mockRejectedValue({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comments post={post} user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.posts.comment.title.replace('{{count}}', "0").replace('{{s}}', ''))).toBeInTheDocument();

        const field = queryByContent("new-comment") as HTMLTextAreaElement;
        const submit = screen.getByText(fr.common.send);

        fireEvent.change(field, {target: {value: "     "}});
        fireEvent.click(submit);

        expect(submitSpy).not.toHaveBeenCalled();
        expect(fetchSpy).not.toHaveBeenCalled();

        fireEvent.change(field, {target: {value: "comment"}});
        fireEvent.click(submit);

        expect(submitSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText(fr.common.tryLater)).toBeInTheDocument();
        })


    });

    it('should post a new comment', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const newPost: IPost = {
            ...post,
            comments: [CommentStub()]
        }
        const submitSpy = jest.spyOn(actions, "commentPost")
        const fetchSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({data: newPost});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comments post={post} user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        const field = queryByContent("new-comment") as HTMLTextAreaElement;
        const submit = screen.getByText(fr.common.send);

        fireEvent.change(field, {target: {value: "commentaire"}});
        fireEvent.click(submit);

        await waitFor(() => {
            expect(submitSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(screen.queryByText(fr.common.tryLater)).not.toBeInTheDocument();
            expect(screen.queryByText(newPost.comments[0].comment)).toBeInTheDocument();
            expect(field.value).toBe("");
            expect(queryByContent(`comment-${newPost.comments[0]._id}`)).toBeInTheDocument();
            expect(screen.getByText(fr.posts.comment.title.replace('{{count}}', "1").replace('{{s}}', ''))).toBeInTheDocument();
        })


    });

    afterEach(() => {
        jest.clearAllMocks();
    })

});