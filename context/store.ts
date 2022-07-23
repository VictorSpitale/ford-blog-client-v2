import {createWrapper, HYDRATE} from "next-redux-wrapper";
import {Action, AnyAction, combineReducers, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {postsReducer} from "./reducers/posts/posts.reducer";
import postReducer from "./reducers/posts/post.reducer";
import {firstHydrateReducer} from "./reducers/firstHydrate.reducer";
import lastPostsReducer from "./reducers/posts/lastPosts.reducer";
import userReducer from "./reducers/users/user.reducer";
import categoriesReducer from "./reducers/categories/categories.reducer";
import selectCategoriesReducer from "./reducers/categories/selectCategories.reducer";
import accountViewReducer from "./reducers/accountView.reducer";
import likedPostsReducer from "./reducers/posts/likedPosts.reducer";
import {currentCommentEditReducer} from "./reducers/posts/currentCommentEdit.reducer";
import {navSearchReducer} from "./reducers/navSearch.reducer";
import categorySlideReducer from "./reducers/categories/categorySlide.reducer";
import {categorizedPostsReducer} from "./reducers/categories/categorizedPosts.reducer";
import errorsReducer from "./reducers/errors.reducer";
import adminViewReducer from "./reducers/admin/adminView.reducer";
import categoriesCountReducer from "./reducers/categories/categoriesCount.reducer";
import usersReducer from "./reducers/users/users.reducer";
import adminPostsLikersReducer from "./reducers/admin/adminPostsLikers.reducer";
import adminCommentedPostsReducer from "./reducers/admin/adminCommentedPosts.reducer";

const combinedReducer = combineReducers({
    posts: postsReducer,
    lastPosts: lastPostsReducer,
    post: postReducer,
    hydrateStatus: firstHydrateReducer,
    user: userReducer,
    users: usersReducer,
    categories: categoriesReducer,
    categoriesWithCount: categoriesCountReducer,
    selectCategories: selectCategoriesReducer,
    accountView: accountViewReducer,
    adminView: adminViewReducer,
    adminPostsLikers: adminPostsLikersReducer,
    adminCommentedPosts: adminCommentedPostsReducer,
    likedPosts: likedPostsReducer,
    currentComment: currentCommentEditReducer,
    navSearch: navSearchReducer,
    categorySlide: categorySlideReducer,
    categorizedPosts: categorizedPostsReducer,
    errors: errorsReducer
})

const reducer = (state: ReturnType<typeof combinedReducer>, action: AnyAction) => {
    /* istanbul ignore if */
    if (action.type === HYDRATE) {
        return {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
    } else {
        return combinedReducer(state, action);
    }
};


export const makeStore = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return configureStore({reducer, devTools: process.env.NODE_ENV !== "production"})
}


type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store['dispatch'];
export type RootState = ReturnType<Store['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;

export const wrapper = createWrapper(makeStore, {debug: process.env.NODE_ENV !== "production"});
