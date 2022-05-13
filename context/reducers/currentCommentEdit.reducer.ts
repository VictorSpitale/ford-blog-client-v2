import {createReducer} from "@reduxjs/toolkit";
import {changeCurrentEditComment} from "../actions/commentEdit.actions";

export type CurrentCommentEditState = {
    commentId: string | undefined;
}

const initial: CurrentCommentEditState = {
    commentId: undefined,
}

export const currentCommentEditReducer = createReducer(initial, (builder) => {
    builder
        .addCase(changeCurrentEditComment, (state, {payload}) => {
            state.commentId = (state.commentId === payload.commentId ? undefined : payload.commentId);
        })
});
