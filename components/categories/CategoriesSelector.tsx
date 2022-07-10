import React, {memo, useCallback, useEffect} from 'react';
import CreatableSelect from "react-select/creatable";
import {useAppDispatch} from "../../context/hooks";
import {ICategory} from "../../shared/types/category.type";
import {ActionMeta, OnChangeValue} from "react-select";
import {
    addSelectedCategories,
    createCategory,
    removeSelectedCategories,
    setSelectedCategories
} from "../../context/actions/categories.actions";
import {useTranslation} from "../../shared/hooks";

interface Option {
    readonly label: string;
    readonly value: string;
    readonly _id: string;
}

type PropsType = {
    defaultCategories: ICategory[];
    selectedCategories: ICategory[];
    categories: ICategory[];
    pending: boolean;
}

const CategoriesSelector = ({categories, pending, defaultCategories, selectedCategories}: PropsType) => {

    const dispatch = useAppDispatch();
    const t = useTranslation();

    const createOption = (category: ICategory): Option => ({
        label: category.name,
        value: category.name.toLowerCase().replace(/\W/g, ""),
        _id: category._id
    });

    const getOptions = () => {
        const options: Option[] = []
        categories?.forEach((cat) => {
            options.push(createOption(cat))
        })
        return options;
    }

    const getDefaultOptions = () => {
        const defaults: Option[] = []
        defaultCategories?.forEach((cat) => {
            getOptions().forEach((opt) => {
                if (opt.label === cat.name) defaults.push(opt)
            })
        })
        return defaults;
    }

    const handleChange = async (
        newValue: OnChangeValue<Option, true>,
        actionMeta: ActionMeta<Option>
    ) => {
        const category = categories.find((cat) => cat.name === actionMeta.option?.label);
        const catToDel = categories.find((cat) => cat.name === actionMeta.removedValue?.label);
        if (actionMeta.action === "select-option" && category) {
            await dispatch(addSelectedCategories(category))
            return;
        }
        /* istanbul ignore else */
        if (actionMeta.action === "remove-value" && catToDel) {
            await dispatch(removeSelectedCategories(catToDel))
            return;
        }
    }

    const handleCreate = async (newValue: string) => {
        await dispatch(createCategory(newValue)).then(async (res) => {
            if (res.meta.requestStatus === "rejected") return;
            await dispatch(addSelectedCategories(res.payload as ICategory))
        })
    }

    const getValues = useCallback(() => {
        const values: Option[] = [];
        selectedCategories?.forEach((cat) => {
            values.push(createOption(cat));
        })
        return values;
    }, [selectedCategories])

    useEffect(() => {
        const setValues = async () => {
            await dispatch(setSelectedCategories(defaultCategories))
        }
        const clear = async () => {
            await dispatch(setSelectedCategories([]))
        }
        setValues();
        return () => {
            clear()
        }
    }, [])

    return (
        <>
            <form data-content={"categories-selector"}>
                <label htmlFor="categories-selector" hidden={true}>categories-selector</label>
                <CreatableSelect
                    isMulti
                    isClearable={false}
                    options={getOptions()}
                    defaultValue={getDefaultOptions()}
                    onChange={handleChange}
                    onCreateOption={handleCreate}
                    isDisabled={pending}
                    value={getValues()}
                    placeholder={t.categories.selectorPlaceholder}
                    inputId={"categories-selector"}
                    name={"categories-selector"}
                />
            </form>
        </>
    );
};

export default memo(CategoriesSelector);