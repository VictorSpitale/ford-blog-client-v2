import React from 'react';
import {AnyFunction} from "../../../shared/types/props.type";
import {className} from "../../../shared/utils/class.utils";

type PropsType = {
    isLiked: boolean;
    onClick: AnyFunction
}

const Heart = ({isLiked, onClick}: PropsType) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" onClick={onClick}
             className={className("h-10 w-10 stroke-red-500 cursor-pointer", (isLiked ? "hover:fill-transparent" : "hover:fill-red-500"), (isLiked ? 'fill-red-500' : ''))}
             fill="none"
             viewBox="0 0 24 24" stroke="currentColor">

            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
};

export default Heart;