export enum AdminViews {
    POSTS = "posts",
    CATEGORIES = "categories",
    USERS = "users",
}

export type ViewButtonType = {
    view: AdminViews;
    label: string;
    isActive: boolean
}

export const getViewType = (view: string) => {
    switch (view) {
        case AdminViews.POSTS.toString():
            return AdminViews.POSTS;
        case AdminViews.CATEGORIES.toString():
            return AdminViews.CATEGORIES;
        case AdminViews.USERS.toString():
            return AdminViews.USERS;
        default:
            return AdminViews.POSTS;
    }
}
