import {createWrapper, HYDRATE} from "next-redux-wrapper";
import {Action, AnyAction, combineReducers, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {postsReducer} from "./reducers/posts.reducer";
import postReducer from "./reducers/post.reducer";
import {firstHydrateReducer} from "./reducers/firstHydrate.reducer";
import lastPostsReducer from "./reducers/lastPosts.reducer";
import userReducer from "./reducers/user.reducer";
import categoriesReducer from "./reducers/categories.reducer";
import selectCategoriesReducer from "./reducers/selectCategories.reducer";
import accountViewReducer from "./reducers/accountView.reducer";

const combinedReducer = combineReducers({
    posts: postsReducer,
    lastPosts: lastPostsReducer,
    post: postReducer,
    hydrateStatus: firstHydrateReducer,
    user: userReducer,
    categories: categoriesReducer,
    selectCategories: selectCategoriesReducer,
    accountView: accountViewReducer
})

const reducer = (state: ReturnType<typeof combinedReducer>, action: AnyAction) => {
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
