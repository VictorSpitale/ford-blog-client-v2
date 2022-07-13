import {makeStore} from "../../../../../context/store";
import {MockUseRouter} from "../../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Comment from "../../../../../components/posts/comments/Comment";
import {CommentStub} from "../../../../stub/CommentStub";
import {UserStub} from "../../../../stub/UserStub";
import {IComment} from "../../../../../shared/types/comment.type";
import {IUser, IUserRole} from "../../../../../shared/types/user.type";
import fr from "../../../../../public/static/locales/fr.json";
import {queryByContent} from "../../../../utils/CustomQueries";
import * as actions from '../../../../../context/actions/commentEdit.actions'
import {CHANGE_CURRENT_EDIT_COMMENT} from '../../../../../context/actions/commentEdit.actions'

describe('CommentTest', function () {
    let updateFn: jest.Mock;
    let deleteFn: jest.Mock;
    let comment: IComment;
    let user: IUser;
    let isEditing: boolean;

    beforeEach(() => {
        updateFn = jest.fn();
        deleteFn = jest.fn();
        comment = CommentStub();
        user = UserStub();
        isEditing = false;
    })

    it('should render a comment', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        user = UserStub(IUserRole.USER, "625d68b498cce1a4044d887d");

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} user={user} isEditing={isEditing}
                             onUpdate={updateFn} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(comment.commenter.pseudo)).toBeInTheDocument();
        expect(screen.getByText(comment.comment)).toBeInTheDocument();

        expect(screen.queryByText(fr.common.confirm)).not.toBeInTheDocument();
        expect(screen.queryByText(fr.common.cancel)).not.toBeInTheDocument();

        expect(queryByContent("trash")).not.toBeDefined();
        expect(queryByContent("edit")).not.toBeDefined();
    });

    it('should render a comment editing', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        isEditing = true;

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} user={user} isEditing={isEditing}
                             onUpdate={updateFn} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.confirm)).toBeInTheDocument();
        expect(screen.getByText(fr.common.cancel)).toBeInTheDocument();

        expect(queryByContent("trash")).toBeInTheDocument();
        expect(queryByContent("edit")).toBeInTheDocument();
    });

    it('should render a modified comment', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        comment = {
            ...comment,
            updatedAt: 1657551603141
        }

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} user={user} isEditing={isEditing}
                             onUpdate={updateFn} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.posts.comment.modified)).toBeInTheDocument();
    });

    it('should render comment editing and canceled', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        const changeCurrentComment = jest.spyOn(actions, "changeCurrentEditComment").mockImplementation(({commentId}) => {
            isEditing = !!commentId;
            return {
                type: CHANGE_CURRENT_EDIT_COMMENT,
                payload: {commentId}
            }
        });

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} onUpdate={updateFn} isEditing={isEditing}
                             user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.click(queryByContent("edit"));
        expect(changeCurrentComment).toHaveBeenNthCalledWith(1, {commentId: comment._id})

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} onUpdate={updateFn} isEditing={isEditing}
                             user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByText(fr.common.confirm)).toBeInTheDocument();
        expect(screen.getByText(fr.common.cancel)).toBeInTheDocument();


        fireEvent.click(screen.getByText(fr.common.cancel));
        expect(changeCurrentComment).toHaveBeenNthCalledWith(2, {commentId: undefined})

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} onUpdate={updateFn} isEditing={isEditing}
                             user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.queryByText(fr.common.confirm)).not.toBeInTheDocument();
        expect(screen.queryByText(fr.common.cancel)).not.toBeInTheDocument();
    });

    it('should delete the comment', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} onUpdate={updateFn} isEditing={isEditing}
                             user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.click(queryByContent("trash"));
        fireEvent.click(screen.getByRole("button", {name: fr.common.delete}));
        expect(deleteFn).toHaveBeenCalledWith(comment);
    });

    it('should update a comment', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const oldComment = comment;
        updateFn.mockImplementation((oldComment, newValue) => {
            comment.comment = newValue;
        })

        jest.spyOn(actions, "changeCurrentEditComment").mockImplementation(({commentId}) => {
            isEditing = !!commentId;
            return {
                type: CHANGE_CURRENT_EDIT_COMMENT,
                payload: {commentId}
            }
        });

        const {rerender} = render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} onUpdate={updateFn} isEditing={isEditing}
                             user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        const newComment = "nouveau!!"

        fireEvent.click(queryByContent("edit"));

        rerender(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Comment comment={comment} onDelete={deleteFn} onUpdate={updateFn} isEditing={isEditing}
                             user={user} />
                </RouterContext.Provider>
            </Provider>
        )

        fireEvent.change(screen.getByText(comment.comment), {target: {value: ""}});
        fireEvent.click(screen.getByText(fr.common.confirm));

        expect(updateFn).not.toHaveBeenCalled();

        fireEvent.change(screen.getByText(comment.comment), {target: {value: comment.comment}});
        fireEvent.click(screen.getByText(fr.common.confirm));

        expect(updateFn).not.toHaveBeenCalled();

        fireEvent.change(screen.getByText(comment.comment), {target: {value: newComment}});
        fireEvent.click(screen.getByText(fr.common.confirm));

        expect(updateFn).toHaveBeenCalledWith(oldComment, newComment);
    });


});