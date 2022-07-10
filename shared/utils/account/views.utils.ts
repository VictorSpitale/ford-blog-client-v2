import {AccountViews, getViewType, ViewButtonType} from "../../types/accountViews.type";
import {Translation} from "../../hooks/useTranslation";

export const getAccountViewButtons = (activeView: AccountViews, t: Translation): ViewButtonType[] => {
    return Object.keys(AccountViews).map((view) => {
        const viewType = getViewType(view.toLowerCase());
        return {
            view: viewType,
            isActive: activeView === viewType,
            label: t.account.viewsName[view as never]
        }
    })
}