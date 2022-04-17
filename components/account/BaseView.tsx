import React from 'react';
import {Children} from "../../shared/types/props.type";

const BaseView = ({children}: { children: Children }) => {
    return (
        <div className={"bg-neutral-50 w-full p-5 rounded-2xl drop-shadow h-fit mt-4 md:mt-0"}>
            {children}
        </div>
    );
};

export default BaseView;