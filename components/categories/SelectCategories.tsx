import React, {memo, useCallback, useEffect} from 'react';
import CreatableSelect from "react-select/creatable";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {ICategory} from "../../shared/types/category.type";
import {ActionMeta, OnChangeValue} from "react-select";
import {
    addSelectedCategories,
    createCategory,
    removeSelectedCategories,
    setSelectedCategories
} from "../../context/actions/categories.actions";

interface Option {
    readonly label: string;
    readonly value: string;
    readonly _id: string;
}

const SelectCategories = () => {
    const {categories, pending} = useAppSelector(state => state.categories);
    const {categories: defaultCategories} = useAppSelector(state => state.post.post)
    const {categories: selectValues} = useAppSelector(state => state.selectCategories)
    const dispatch = useAppDispatch();

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
        selectValues?.forEach((cat) => {
            values.push(createOption(cat));
        })
        return values;
    }, [selectValues])

    useEffect(() => {
        const setValues = async () => {
            await dispatch(setSelectedCategories(defaultCategories || []))
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
        <CreatableSelect
            isMulti
            isClearable={false}
            options={getOptions()}
            defaultValue={getDefaultOptions()}
            onChange={handleChange}
            onCreateOption={handleCreate}
            isDisabled={pending}
            value={getValues()}
        />
    );
};

export default memo(SelectCategories);