import LikesView from "../../components/account/LikesView";
import ProfileView from "../../components/account/ProfileView";
import SecurityView from "../../components/account/SecurityView";

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

export const getAccountView = (view: AccountViews | string) => {
    switch (view) {
        case AccountViews.LIKES:
        case AccountViews.LIKES.toString():
            return <LikesView />
        case AccountViews.PROFILE:
        case AccountViews.PROFILE.toString():
            return <ProfileView />
        case AccountViews.SECURITY:
        case AccountViews.SECURITY.toString():
            return <SecurityView />
    }
}
