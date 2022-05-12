import {createAction} from "@reduxjs/toolkit";
import {CurrentCommentEditState} from "../reducers/currentCommentEdit.reducer";

export const CHANGE_CURRENT_EDIT_COMMENT = "CHANGE_CURRENT_EDIT_COMMENT";

export const changeCurrentEditComment = createAction<CurrentCommentEditState>(CHANGE_CURRENT_EDIT_COMMENT);