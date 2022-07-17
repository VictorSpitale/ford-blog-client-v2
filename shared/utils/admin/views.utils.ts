import {Translation} from "../../hooks/useTranslation";
import {AdminViews, getViewType, ViewButtonType} from "../../types/adminViews.type";

export const getAdminViewButtons = (activeView: AdminViews, t: Translation): ViewButtonType[] => {
    return Object.keys(AdminViews).map((view) => {
        const viewType = getViewType(view.toLowerCase());
        return {
            view: viewType,
            isActive: activeView === viewType,
            label: t.admin.viewsName[view as never]
        }
    })
}