import React from 'react';
import RenderIf from "./RenderIf";

type PropsType = {
    error: string;
}

const ErrorMessage = ({error}: PropsType) => {
    return (
        <RenderIf condition={!!error}>
            <p className={"rounded w-full bg-red-400 text-white px-3 text-justify mb-5"}>{error}</p>
        </RenderIf>
    );
};

export default ErrorMessage;