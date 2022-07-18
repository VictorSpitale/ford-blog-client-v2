import React from 'react';
import {AnyFunction} from "../../shared/types/props.type";
import {className} from "../../shared/utils/class.utils";

type PropsType = {
    activeTab: string,
    label: string,
    onClick: AnyFunction
}

const Tab = ({activeTab, onClick, label}: PropsType) => {
    return (
        <li className={className(
            "list-none inline-block border-b border-secondary-200 cursor-pointer px-2 py-3",
            activeTab === label ? "border-b-0 border text-secondary-500" : ""
        )} onClick={() => onClick(label)}>
            {label}
        </li>
    );
};

export default Tab;