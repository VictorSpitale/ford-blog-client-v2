import React, {ChangeEvent, ForwardedRef, forwardRef, HTMLInputTypeAttribute} from 'react';

type PropsType = {
    name: string;
    label?: string;
    value?: string | number | readonly string[];
    placeholder?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => any;
    required?: boolean;
    type?: HTMLInputTypeAttribute,
    autoComplete?: string;
}

const TextAreaField = forwardRef(({
                                      label,
                                      required,
                                      placeholder,
                                      onChange,
                                      name,
                                      value,
                                      autoComplete
                                  }: PropsType, ref: ForwardedRef<HTMLTextAreaElement>) => {


    return (
        <label className={"w-full text-gray-500"}>
            {label}
            <textarea
                className={"resize-none c-scroll w-full mt-2 pb-1 bg-transparent border-b-2 border-gray-400 outline-0"}
                ref={ref} placeholder={placeholder} id={name}
                defaultValue={value} onChange={onChange} rows={10}
                required={required} autoComplete={autoComplete} />
        </label>
    );
});
TextAreaField.displayName = "TextAreaField"
export default TextAreaField;