export enum AccountViews {
    PROFILE = "profile",
    SECURITY = "security",
    LIKES = "likes",
}

export type ViewButtonType = {
    view: AccountViews;
    label: string;
    isActive: boolean
}

export const getViewType = (view: string) => {
    switch (view) {
        case AccountViews.LIKES.toString():
            return AccountViews.LIKES;
        case AccountViews.PROFILE.toString():
            return AccountViews.PROFILE;
        case AccountViews.SECURITY.toString():
            return AccountViews.SECURITY;
        default:
            return AccountViews.PROFILE;
    }
}
