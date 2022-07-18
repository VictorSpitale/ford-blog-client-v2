import React, {useCallback, useEffect} from 'react';
import BaseView from "../../shared/BaseView";
import {useTranslation} from "../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import RenderIf from "../../shared/RenderIf";
import {isEmpty} from "../../../shared/utils/object.utils";
import Table from "../../table/Table";
import {getCategoriesWithCount} from "../../../context/actions/categories.actions";
import {ICategory} from "../../../shared/types/category.type";

const CategoriesView = () => {

    const t = useTranslation();
    const dispatch = useAppDispatch();
    const {categories, pending} = useAppSelector(state => state.categoriesWithCount);

    const fetchCategories = useCallback(async () => {
        await dispatch(getCategoriesWithCount());
    }, [dispatch]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const openDetails = useCallback((category: ICategory) => {
        console.log("details :", category);
    }, []);

    const openEdit = useCallback((category: ICategory) => {
        console.log("edition :", category)
    }, [])

    const openDelete = useCallback((category: ICategory) => {
        console.log("suppression :", category)
    }, [])

    return (
        <BaseView>
            <div className={"flex items-center mb-4"}>
                <h1 className={"text-2xl font-semibold"}>{t.admin.categories.title}</h1>
                <RenderIf condition={pending}>
                    <p className={"italic ml-4"}>Chargement...</p>
                </RenderIf>
            </div>
            <RenderIf condition={isEmpty((categories))}>
                <p>Aucune catégories disponible</p>
            </RenderIf>
            <RenderIf condition={!isEmpty((categories))}>
                <Table keys={[
                    {key: "name", label: "Nom"},
                    {key: "count", label: "Articles liés"},
                ]} data={categories} sortable={true} onOpen={openDetails} actions={[
                    {
                        label: "Modifier",
                        color: "primary",
                        onClick: openEdit
                    }, {
                        label: "Supprimer",
                        onClick: openDelete,
                        color: "danger"
                    }
                ]}
                />
            </RenderIf>
        </BaseView>
    );
};

export default CategoriesView;