import React, {ForwardedRef, forwardRef, HTMLInputTypeAttribute} from 'react';
import {AnyFunction} from "../../shared/types/props.type";

type PropsType = {
    name: string;
    label?: string;
    value?: never;
    placeholder?: string;
    onChange?: AnyFunction;
    required?: boolean;
    type?: HTMLInputTypeAttribute,
    autoComplete?: string;
}

const InputField = forwardRef(({
                                   label,
                                   required,
                                   placeholder,
                                   onChange,
                                   name,
                                   value,
                                   type,
                                   autoComplete
                               }: PropsType, ref: ForwardedRef<HTMLInputElement>) => {


    return (
        <label className={"w-full text-gray-500"}>
            {label}
            <input className={"w-full mt-2 pb-1 bg-transparent border-b-2 border-gray-400 outline-0"}
                   ref={ref} type={type} placeholder={placeholder} id={name}
                   defaultValue={value} onChange={onChange}
                   required={required} autoComplete={autoComplete} />
        </label>
    );
});
InputField.displayName = "InputField"
export default InputField;