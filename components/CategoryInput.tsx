import React, {useState} from 'react';
import {ICategory} from "../shared/types/category.type";
import {capitalize} from "../shared/utils/string.utils";
import {AnyFunction} from "../shared/types/props.type";

type PropsType = {
    onClick?: AnyFunction,
    category?: ICategory | string
    disable?: boolean,
    active?: boolean,
    more?: number
}

const CategoryInput = ({onClick, category, disable, active, more}: PropsType) => {

    const catName = (typeof category === "string" ? category : category?.name)

    const [isChecked, setIsChecked] = useState(active ? active : false)
    const onChecked = (callback: AnyFunction) => {
        setIsChecked(!isChecked)
        callback && callback()
    }

    if (!onClick) disable = true

    return (
        <div className={"box-border float-left relative w-fit"}>
            <input id={catName && catName} defaultChecked={active} disabled={disable}
                   onChange={(e) => onClick && onChecked(onClick(e) as AnyFunction)}
                   className={`h-full w-full absolute top-0 opacity-0 left-0 ${!disable && 'cursor-pointer'}`}
                   type="checkbox" value={catName && catName} />
            <div
                className={`${isChecked ? 'bg-secondary-500 text-white' : 'text-secondary-600'} border border-secondary-600 
                text-sm md:text-base px-2 md:px-4 w-full flex rounded-2xl`}>
                <label htmlFor={catName && catName}
                       className={"text-inherit"}>{catName ? capitalize(catName) : `+ ${more}`}</label>
            </div>
        </div>
    );
};

export default CategoryInput;