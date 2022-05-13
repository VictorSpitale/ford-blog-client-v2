import React, {memo} from 'react';
import {ICategory} from "../../shared/types/category.type";

type PropsType = {
    category?: ICategory
    more?: number
}

const CategoryInput = ({category, more}: PropsType) => {

    return (
        <div
            className={'w-fit text-secondary-600 border border-secondary-600 ' +
                'text-sm md:text-base px-2 md:px-4 flex rounded-2xl'}>
            {category ? category.name : `+ ${more}`}
        </div>
    );
};

export default memo(CategoryInput);