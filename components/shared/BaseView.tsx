import React from 'react';
import {Children} from "../../shared/types/props.type";
import {className} from "../../shared/utils/class.utils";

const BaseView = ({children, className: classes = ""}: { children: Children, className?: string }) => {
    return (
        <div
            className={className("c-scroll bg-neutral-50 w-full p-5 rounded-2xl drop-shadow h-fit mt-4 md:mt-0 max-h-[600px] overflow-y-auto", classes)}>
            {children}
        </div>
    );
};

export default BaseView;