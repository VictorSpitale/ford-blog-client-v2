import React, {useCallback, useEffect, useState} from 'react';
import BaseView from "../../shared/BaseView";
import {useModal, useTranslation} from "../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import RenderIf from "../../shared/RenderIf";
import {isEmpty} from "../../../shared/utils/object.utils";
import Table from "../../table/Table";
import {getCategoriesWithCount} from "../../../context/actions/categories/categories.actions";
import {ICategory} from "../../../shared/types/category.type";
import DetailsModal from "../modals/details/DetailsModal";
import UpdateCategoryModal from "../modals/update/UpdateCategoryModal";
import DeleteCategoryModal from "../modals/update/DeleteCategoryModal";

const CategoriesView = () => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const {categories, pending} = useAppSelector(state => state.categoriesWithCount);

    const {
        toggle: toggleDetails,
        isShowing: isDetailsShowing,
        addOtherModal,
        otherModal,
        previous,
        hasPrevious
    } = useModal();

    const {toggle: toggleEdit, isShowing: isEditShowing} = useModal();
    const {toggle: toggleDelete, isShowing: isDeleteShowing} = useModal();

    const [activeCategory, setActiveCategory] = useState({} as ICategory);

    const fetchCategories = useCallback(async () => {
        await dispatch(getCategoriesWithCount());
    }, [dispatch]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const openDetails = useCallback((category: ICategory) => {
        setActiveCategory({...category});
        toggleDetails();
    }, []);

    const openEdit = useCallback((category: ICategory) => {
        setActiveCategory({...category});
        toggleEdit();
    }, [])

    const openDelete = useCallback((category: ICategory) => {
        setActiveCategory({...category});
        toggleDelete();
    }, [])

    return (
        <>
            <RenderIf condition={isDetailsShowing}>
                <DetailsModal isShowing={isDetailsShowing} toggle={toggleDetails}
                              content={{type: "categories", data: activeCategory}} otherModal={otherModal}
                              setOtherModal={addOtherModal}
                              hasPrevious={hasPrevious} previous={previous} />
            </RenderIf>
            <RenderIf condition={isEditShowing}>
                <UpdateCategoryModal isShowing={isEditShowing} toggle={toggleEdit} category={activeCategory} />
            </RenderIf>
            <RenderIf condition={isDeleteShowing}>
                <DeleteCategoryModal isShowing={isDeleteShowing} toggle={toggleDelete} category={activeCategory} />
            </RenderIf>
            <BaseView>
                <div className={"flex items-center mb-4"}>
                    <h1 className={"text-2xl font-semibold"}>{t.admin.categories.title}</h1>
                    <RenderIf condition={pending}>
                        <p className={"italic ml-4"}>{t.common.loading}</p>
                    </RenderIf>
                </div>
                <RenderIf condition={isEmpty((categories))}>
                    <p>{t.common.noCategory}</p>
                </RenderIf>
                <RenderIf condition={!isEmpty((categories))}>
                    <Table keys={[
                        {key: "name", label: t.admin.tabs.name},
                        {key: "count", label: t.admin.tabs.relatedPosts},
                    ]} data={categories} sortable={true} onOpen={openDetails} actions={[
                        {
                            label: t.common.update,
                            color: "primary",
                            onClick: openEdit
                        }, {
                            label: t.common.delete,
                            onClick: openDelete,
                            color: "danger"
                        }
                    ]}
                    />
                </RenderIf>
            </BaseView>
        </>
    );
};

export default CategoriesView;