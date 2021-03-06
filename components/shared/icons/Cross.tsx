import React from 'react';

const Cross = () => {
    return (
        <svg data-content={"cross"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200px"
             height="200px">
            <circle cx="52" cy="52" r="44" opacity=".35" />
            <circle cx="50" cy="50" r="44" fill="#f2f2f2" />
            <path fill="#f2f2f2" d="M50,91C27.393,91,9,72.607,9,50S27.393,9,50,9s41,18.393,41,41S72.607,91,50,91z" />
            <circle cx="50.026" cy="50.026" r="38.026" fill="#ff7575" />
            <circle cx="50" cy="50" r="37.5" fill="none" stroke="#40396e" strokeMiterlimit="10" strokeWidth="3" />
            <line x1="35.858" x2="64.142" y1="35.858" y2="64.142" fill="none" stroke="#fff" strokeLinecap="round"
                  strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="6" />
            <line x1="64.142" x2="35.858" y1="35.858" y2="64.142" fill="none" stroke="#fff" strokeLinecap="round"
                  strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="6" />
        </svg>
    );
};

export default Cross;