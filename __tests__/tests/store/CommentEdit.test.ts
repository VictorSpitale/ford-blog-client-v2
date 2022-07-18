import {
    currentCommentEditReducer,
    CurrentCommentEditState
} from "../../../context/reducers/posts/currentCommentEdit.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {changeCurrentEditComment} from "../../../context/actions/posts/commentEdit.actions";

describe('CommentEdit Actions & Reducers', function () {


    const initialState: CurrentCommentEditState = {
        commentId: undefined,
    }

    it('should return the initial state', function () {
        expect(currentCommentEditReducer(undefined, {} as AnyAction)).toEqual(initialState);
    });

    describe('changeCurrentEditComment', function () {

        it('should set the current comment id', function () {
            const action: AnyAction = {
                type: changeCurrentEditComment,
                payload: {commentId: "id"}
            }
            const state = currentCommentEditReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                commentId: "id"
            })
        });

        it('should reset state on set the same current comment id', function () {
            const action: AnyAction = {
                type: changeCurrentEditComment,
                payload: {commentId: "id"}
            }
            const state = currentCommentEditReducer({commentId: "id"}, action);
            expect(state).toEqual({
                ...initialState,
                commentId: undefined
            })
        });

    });

});