import React, {memo} from 'react';
import {AnyFunction} from "../../shared/types/props.type";
import {className} from "../../shared/utils/class.utils";
import Link from "next/link";

export type ButtonsProps = {
    text: string;
    classes?: string;
    type?: "button" | "submit" | "reset" | undefined;
    style?: "primary" | "danger" | "gray"
}

type ElementProps = { element: "button"; onClick?: AnyFunction, type?: string } | { element: "link"; onClick: string }

type PropsType = ButtonsProps & ElementProps;

const Button = ({element, onClick, text, classes, type, style = "primary"}: PropsType) => {

    const buttonStyle = className(
        style === "primary" ? "bg-primary-400 shadow-primary-300/40 hover:shadow-primary-300/60 hover:bg-primary-500" : '',
        style === "danger" ? "bg-red-400 shadow-red-300/40 hover:shadow-red-300/60 hover:bg-red-500" : '',
        style === "gray" ? "bg-gray-400 shadow-gray-300/40 hover:shadow-gray-300/60 hover:bg-gray-500" : '',
        "text-white px-2 py-1 rounded-lg shadow-md",
        classes || '')

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