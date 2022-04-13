import React from 'react';
import {AnyFunction} from "../../../shared/types/props.type";

const Edit = ({callback}: { callback?: AnyFunction }) => {
    return (
        <svg style={{cursor: "pointer"}} onClick={callback} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"
             width="30px" height="30px">
            <path fill="#f5ce85" d="M5.982 29.309L8.571 26.719 13.618 31.115 10.715 34.019 2.453 37.547z" />
            <path fill="#967a44"
                  d="M8.595,27.403l4.291,3.737l-2.457,2.457l-7.026,3.001l3.001-7.003L8.595,27.403 M8.548,26.036 l-2.988,2.988l-4.059,9.474L11,34.44l3.351-3.351L8.548,26.036L8.548,26.036z" />
            <path fill="#36404d" d="M3.805 33.13L1.504 38.5 6.888 36.201z" />
            <path fill="#f78f8f"
                  d="M30.062,5.215L32.3,2.978C32.931,2.347,33.769,2,34.66,2s1.729,0.347,2.36,0.978 c1.302,1.302,1.302,3.419,0,4.721l-2.237,2.237L30.062,5.215z" />
            <path fill="#c74343"
                  d="M34.66,2.5c0.758,0,1.471,0.295,2.007,0.831c1.107,1.107,1.107,2.907,0,4.014l-1.884,1.884 L30.77,5.215l1.884-1.884C33.189,2.795,33.902,2.5,34.66,2.5 M34.66,1.5c-0.982,0-1.965,0.375-2.714,1.124l-2.591,2.591 l5.428,5.428l2.591-2.591c1.499-1.499,1.499-3.929,0-5.428v0C36.625,1.875,35.643,1.5,34.66,1.5L34.66,1.5z" />
            <g>
                <path fill="#ffeea3"
                      d="M11.346,33.388c-0.066-0.153-0.157-0.308-0.282-0.454c-0.31-0.363-0.749-0.584-1.31-0.661 c-0.2-1.267-1.206-1.803-1.989-1.964c-0.132-0.864-0.649-1.342-1.201-1.582l21.49-21.503l4.721,4.721L11.346,33.388z" />
                <path fill="#ba9b48"
                      d="M28.054,7.931l4.014,4.014L11.431,32.594c-0.242-0.278-0.638-0.59-1.261-0.748 c-0.306-1.078-1.155-1.685-1.983-1.943c-0.151-0.546-0.447-0.968-0.821-1.272L28.054,7.931 M28.053,6.517L5.56,29.023 c0,0,0.007,0,0.021,0c0.197,0,1.715,0.054,1.715,1.731c0,0,1.993,0.062,1.993,1.99c1.982,0,1.71,1.697,1.71,1.697l22.482-22.495 L28.053,6.517L28.053,6.517z" />
            </g>
            <g>
                <path fill="#d9e7f5" d="M29.107 4.764H34.685V11.440999999999999H29.107z"
                      transform="rotate(-45.009 31.895 8.103)" />
                <path fill="#788b9c"
                      d="M31.507,4.477l4.014,4.014l-3.237,3.237L28.27,7.714L31.507,4.477 M31.507,3.063l-4.651,4.651 l5.428,5.428l4.651-4.651L31.507,3.063L31.507,3.063z" />
            </g>
        </svg>
    );
};

export default Edit;