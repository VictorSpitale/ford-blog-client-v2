import React from 'react';
import {Children} from "../../shared/types/props.type";

type PropsType = {
    condition: boolean;
    children: Children;
}

const RenderIf = ({condition, children}: PropsType) => {

    if (!condition) return <></>

    return (
        <>
            {children}
        </>
    );
};

export default RenderIf;