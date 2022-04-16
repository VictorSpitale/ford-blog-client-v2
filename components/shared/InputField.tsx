import React, {ChangeEvent, ForwardedRef, forwardRef, HTMLInputTypeAttribute} from 'react';
import {className} from "../../shared/utils/class.utils";

type PropsType = {
    name: string;
    label?: string;
    value?: string | number | readonly string[];
    placeholder?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => any;
    required?: boolean;
    type?: HTMLInputTypeAttribute;
    autoComplete?: string;
    disabled?: boolean;
}

const InputField = forwardRef(({
                                   label,
                                   required,
                                   placeholder,
                                   onChange,
                                   name,
                                   value,
                                   type,
                                   autoComplete,
                                   disabled
                               }: PropsType, ref: ForwardedRef<HTMLInputElement>) => {


    return (
        <label className={"w-full text-gray-500"}>
            {label}
            <input className={className("w-full mt-2 pb-1 bg-transparent border-b-2 border-gray-400 outline-0",
                disabled ? "opacity-50 pl-2 rounded bg-gray-200 text-gray-500 border-b-0 cursor-not-allowed" : "")}
                   ref={ref} type={type} placeholder={placeholder} id={name}
                   defaultValue={value} onChange={onChange} disabled={disabled}
                   required={required} autoComplete={autoComplete} />
        </label>
    );
});
InputField.displayName = "InputField"
export default InputField;