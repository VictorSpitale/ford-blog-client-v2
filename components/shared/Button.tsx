import React, {memo} from 'react';
import {AnyFunction} from "../../shared/types/props.type";
import {className} from "../../shared/utils/class.utils";
import Link from "next/link";

type BaseProps = {
    text: string;
    classes?: string;
    type?: "button" | "submit" | "reset" | undefined
}

type ButtonProps = { element: "button"; onClick?: AnyFunction, type?: string } | { element: "link"; onClick: string }

type PropsType = BaseProps & ButtonProps;

const Button = ({element, onClick, text, classes, type}: PropsType) => {

    const buttonStyle = className(classes || '', "bg-primary-400 text-white px-2 py-1 rounded-lg shadow-md" +
        " shadow-primary-300/40 hover:shadow-primary-300/60 hover:bg-primary-500")

    return (
        <>
            {element === "button" ?
                <button className={buttonStyle} onClick={onClick} type={type}>
                    {text}
                </button>
                : element === "link" &&
				<Link href={onClick}>
					<a className={buttonStyle}>{text}</a>
				</Link>
            }
        </>
    )
};
export default memo(Button);